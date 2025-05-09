package helm

type Entry struct {
	ApiVersion   string   `json:"apiVersion"`
	AppVersion   string   `json:"appVersion"`
	Name         string   `json:"name"`
	Version      string   `json:"version"`
	Urls         []string `json:"urls"`
	Created      string   `json:"created"`
	Digest       string   `json:"digest"`
	Deprecated   bool     `json:"deprecated"`
	Home         string   `json:"home"`
	Description  string   `json:"description"`
	Keywords     []string `json:"keywords"`
	Icon         string   `json:"icon"`
	Links        []string `json:"links"`
	Source       string   `json:"source"`
	Dependencies []struct {
		Name       string   `json:"name"`
		Version    string   `json:"version"`
		Repository string   `json:"repository"`
		Condition  string   `json:"condition"`
		Tags       []string `json:"tags"`
		Enabled    bool     `json:"enabled"`
	} `json:"dependencies"`
	Annotations map[string]string `json:"annotations"`
	Maintainers []struct {
		Name  string `json:"name"`
		Email string `json:"email"`
	} `json:"maintainers"`
}

type Index struct {
	ApiVersion string             `json:"apiVersion"`
	Entries    map[string][]Entry `json:"entries"`
}

type Release struct {
	Name string `json:"name"`
	Info struct {
		Status        string `json:"status"`
		Notes         string `json:"notes"`
		Description   string `json:"description"`
		Deleted       string `json:"deleted"`
		LastDeployed  string `json:"last_deployed"`
		FirstDeployed string `json:"first_deployed"`
	} `json:"info"`
	Chart struct {
		Metadata struct {
			Name        string `json:"name"`
			Version     string `json:"version"`
			ApiVersion  string `json:"apiVersion"`
			Description string `json:"description"`
			AppVersion  string `json:"appVersion"`
			Type        string `json:"type"`
		} `json:"metadata"`
		Lock      interface{}              `json:"lock"`
		Templates []map[string]interface{} `json:"templates"`
		Values    map[string]interface{}   `json:"values"`
		Files     []map[string]interface{} `json:"files"`
		Schema    interface{}              `json:"schema"`
	} `json:"chart"`
	Namespace string                   `json:"namespace"`
	Manifest  string                   `json:"manifest"`
	Version   int                      `json:"version"`
	Hooks     []map[string]interface{} `json:"hooks"`
}
