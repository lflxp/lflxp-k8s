package helm

import "testing"

func Test_RepoListLocal(t *testing.T) {
	// Initialize the Helm instance
	helm := Helm{}
	helm.BIN = "/usr/local/bin/helm"
	helm.KubeConfig = "/home/lixueping/.kube/config"
	helm.HelmHome = "/home/lixueping/.cache/helm"

	// Call the RepoList method
	data, err := helm.RepoListLocal("bitnami")
	if err != nil {
		t.Errorf("RepoList() error = %v", err)
	}

	t.Logf("RepoList apiVersion = %s", data.ApiVersion)
}

func Test_GetReleaseAllParse(t *testing.T) {
	data, err := GetReleaseAllParse()
	if err != nil {
		t.Errorf("GetReleaseAllParse() error = %v", err)
	}
	t.Logf("GetReleaseAllParse() data = %v", data)
}
