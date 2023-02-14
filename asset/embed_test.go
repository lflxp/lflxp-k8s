package asset

import "testing"

func Test_RunYaml(t *testing.T) {
	err := RunYaml("yaml/monitor")
	if err != nil {
		t.Fatalf("Failed to run")
	}
}
