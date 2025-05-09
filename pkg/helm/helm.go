package helm

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"log/slog"
	"os"

	"github.com/lflxp/lflxp-k8s/pkg/apiserver/model"
	"github.com/lflxp/lflxp-k8s/utils"
	"gopkg.in/yaml.v3"
	v1c "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

// 完成helm基于k8s的接口封装
// 主要功能：
// 1. 安装helm chart
// 2. 卸载helm chart
// 3. 升级helm chart
// 4. 回滚helm chart
// 5. 获取helm chart的状态
// 6. 获取helm chart的历史版本
// 7. 获取helm chart的值
// 8. 获取helm chart的版本
// 9. 获取helm chart的名称
// 10. 获取helm chart的命名空间
// 11. 获取helm chart的仓库
// 12. 获取helm chart的仓库地址
// 13. 使用helm 命令进行操作
// 14. 读取k8s secret sh.helm.release.v1的数据
// 15. 读取release中的values.yaml
// 16. 管理helm repo (CRUD)

type Helm struct {
	BIN          string
	WorkingDir   string
	HelmHome     string
	KubeConfig   string
	Namespace    string
	ReleaseName  string
	ChartName    string
	ChartVersion string
	ChartRepo    string
	ChartRepoURL string
}

func NewHelm() *Helm {
	return &Helm{
		BIN:        HelmBin,
		HelmHome:   HelmHome,
		KubeConfig: HelmKubeConfig,
	}
}

// 更新helm repo
func (h *Helm) RepoUpdate() error {
	// helm repo update
	cmd := h.BIN + " repo update"
	_, err := utils.ExecCommandLinuxWithWorkdir(fmt.Sprintf("%s --kubeconfig %s", cmd, h.KubeConfig), h.WorkingDir)
	if err != nil {
		return err
	}
	return nil
}

// sqlite记录helm repo
func (h *Helm) RepoAdd() error {
	// helm repo add
	cmd := h.BIN + " repo add " + h.ChartRepo + " " + h.ChartRepoURL
	_, err := utils.ExecCommandLinuxWithWorkdir(fmt.Sprintf("%s --kubeconfig %s", cmd, h.KubeConfig), h.WorkingDir)
	if err != nil {
		return err
	}
	return nil
}

// helm repo remove
func (h *Helm) RepoRemove() ([]byte, error) {
	// helm repo remove
	cmd := h.BIN + " repo remove " + h.ChartRepo
	data, err := utils.ExecCommandLinuxWithWorkdir(fmt.Sprintf("%s --kubeconfig %s", cmd, h.KubeConfig), h.WorkingDir)
	if err != nil {
		return data, err
	}
	return data, nil
}

// helm repo list
func (h *Helm) RepoList() ([]byte, error) {
	// helm repo list
	cmd := h.BIN + " repo list"
	data, err := utils.ExecCommandLinuxWithWorkdir(fmt.Sprintf("%s --kubeconfig %s|grep -v NAME|awk '{print $1\"|\"$2}'", cmd, h.KubeConfig), h.WorkingDir)
	if err != nil {
		return data, err
	}
	return data, nil
}

// helm repo update save
func (h *Helm) RepoListLocal(repo string) (Index, error) {
	var index Index
	// 判断~/.cache/helm/repository 文件夹是否存在
	if !utils.IsPathExists(h.HelmHome + "/repository") {
		return index, fmt.Errorf("helm repository not exists")
	}

	if !utils.IsPathExists(h.HelmHome + "/repository/" + repo + "-index.yaml") {
		return index, fmt.Errorf("helm repository %s-index.yaml not exists", repo)
	}

	// 读取~/.cache/helm/repository 文件夹下的文件
	file, err := os.Open(h.HelmHome + "/repository/" + repo + "-index.yaml")
	if err != nil {
		return index, fmt.Errorf("failed to open file: %v", err)
	}
	defer file.Close()

	decoder := yaml.NewDecoder(file)
	if err := decoder.Decode(&index); err != nil {
		return index, fmt.Errorf("failed to decode yaml: %v", err)
	}

	return index, nil
}

// 获取部署的chart
func GetReleaseAll() ([]v1c.Secret, error) {
	data := model.GetGVR{
		Group:    "",
		Version:  "v1",
		Resource: "secrets",
		ListOptions: metav1.ListOptions{
			LabelSelector: "owner=helm",
		},
	}

	list, err := data.List()
	if err != nil {
		slog.With("Error", err.Error()).Error("Error listing secrets")
		return nil, err
	}

	result := make([]v1c.Secret, 0)
	for _, item := range list.Items {
		var data v1c.Secret
		toBytes, err := item.MarshalJSON()
		if err != nil {
			slog.With("Error", err.Error()).Error("Error marshalling secret to JSON")
			continue
		}
		if err := json.Unmarshal(toBytes, &data); err != nil {
			slog.With("Error", err.Error()).Error("Error unmarshalling JSON to secret")
			continue
		}
		// 解析数据
		result = append(result, data)
	}
	return result, nil
}

func GetReleaseAllParse() (map[string]interface{}, error) {
	data := model.GetGVR{
		Group:    "",
		Version:  "v1",
		Resource: "secrets",
		ListOptions: metav1.ListOptions{
			LabelSelector: "owner=helm",
		},
	}

	list, err := data.List()
	if err != nil {
		slog.With("Error", err.Error()).Error("Error listing secrets")
		return nil, err
	}

	result := make(map[string]interface{}, 0)
	for _, item := range list.Items {
		var data v1c.Secret
		toBytes, err := item.MarshalJSON()
		if err != nil {
			slog.With("Error", err.Error()).Error("Error marshalling secret to JSON")
			continue
		}
		if err := json.Unmarshal(toBytes, &data); err != nil {
			slog.With("Error", err.Error()).Error("Error Unmarshal secret to JSON")
			continue
		}
		if data.Type == "helm.sh/release.v1" {
			// 获取data字段中的release数据
			releaseData, exists := data.Data["release"]
			if !exists {
				continue
			}

			// 解码base64
			decoded, err := base64.StdEncoding.DecodeString(string(releaseData))
			if err != nil {
				slog.With("Name", data.Name, "Error", err.Error()).Error("Failed to decode secret")
				continue
			}

			decoded, err = utils.Gunzip(decoded)
			if err != nil {
				slog.With("Name", data.Name, "Error", err.Error()).Error("Failed to gunzip secret")
				continue
			}

			// Helm release结构（简化版）
			// type HelmRelease struct {
			// 	Name      string `json:"name"`
			// 	Version   int    `json:"version"`
			// 	Namespace string `json:"namespace"`
			// }

			var release Release

			// 解析JSON
			if err := json.Unmarshal(decoded, &release); err != nil {
				slog.With("Name", data.Name, "Error", err.Error()).Error("Failed to parse release")
				continue
			}

			fmt.Printf("Helm Release: %s \n",
				release.Chart.Metadata.Name,
			)
			fmt.Printf("  Status: %s\n", release.Info.Status)
			result[fmt.Sprintf("%s-%s", data.Namespace, data.Name)] = release
		}
	}
	return result, nil
}

func GetReleaseByNamespace(ns string) ([]v1c.Secret, error) {
	data := model.GetGVR{
		Group:     "",
		Version:   "v1",
		Resource:  "secrets",
		Namespace: ns,
		ListOptions: metav1.ListOptions{
			LabelSelector: "owner=helm",
		},
	}

	list, err := data.List()
	if err != nil {
		slog.With("Error", err.Error()).Error("Error listing secrets")
		return nil, err
	}

	result := make([]v1c.Secret, 0)
	for _, item := range list.Items {
		var data v1c.Secret
		toBytes, err := item.MarshalJSON()
		if err != nil {
			slog.With("Error", err.Error()).Error("Error marshalling secret to JSON")
			continue
		}
		if err := json.Unmarshal(toBytes, &data); err != nil {
			slog.With("Error", err.Error()).Error("Error unmarshalling JSON to secret")
			continue
		}
		// 解析数据
		result = append(result, data)
	}
	return result, nil
}

func GetReleaseByNamespaceParse(ns string) (map[string]interface{}, error) {
	data := model.GetGVR{
		Group:     "",
		Version:   "v1",
		Resource:  "secrets",
		Namespace: ns,
		ListOptions: metav1.ListOptions{
			LabelSelector: "owner=helm",
		},
	}

	list, err := data.List()
	if err != nil {
		slog.With("Error", err.Error()).Error("Error listing secrets")
		return nil, err
	}

	result := make(map[string]interface{}, 0)
	for _, item := range list.Items {
		var data v1c.Secret
		toBytes, err := item.MarshalJSON()
		if err != nil {
			slog.With("Error", err.Error()).Error("Error marshalling secret to JSON")
			continue
		}
		if err := json.Unmarshal(toBytes, &data); err != nil {
			slog.With("Error", err.Error()).Error("Error Unmarshal secret to JSON")
			continue
		}
		if data.Type == "helm.sh/release.v1" {
			// 获取data字段中的release数据
			releaseData, exists := data.Data["release"]
			if !exists {
				continue
			}

			// 解码base64
			decoded, err := base64.StdEncoding.DecodeString(string(releaseData))
			if err != nil {
				slog.With("Name", data.Name, "Error", err.Error()).Error("Failed to decode secret")
				continue
			}

			decoded, err = utils.Gunzip(decoded)
			if err != nil {
				slog.With("Name", data.Name, "Error", err.Error()).Error("Failed to gunzip secret")
				continue
			}

			var release Release

			// 解析JSON
			if err := json.Unmarshal(decoded, &release); err != nil {
				slog.With("Name", data.Name, "Error", err.Error()).Error("Failed to parse release")
				continue
			}

			fmt.Printf("Helm Release: %s \n",
				release.Chart.Metadata.Name,
			)
			fmt.Printf("  Status: %s\n", release.Info.Status)
			result[fmt.Sprintf("%s-%s", data.Namespace, data.Name)] = release
		}
	}
	return result, nil
}
