all: run

run: npm mod swaggerfast
	showme watch	

generate: stringer updated
	go generate

stringer:
	go get golang.org/x/tools/cmd/stringer

npm: clean
	# cd d2admin && npm install && npm run build && mv dist ../asset/d2admin
	cd d2admin && npm run build && mv dist ../asset/d2admin

npmbuild: clean
	export NODE_OPTIONS=--openssl-legacy-provider && cd d2admin && npm install && npm run build && mv dist ../asset/d2admin

log:
	fhst tool log

migrate:
	go run main.go migrate

mod:
	go mod tidy

gowatch:
	go get github.com/silenceper/gowatch

swagger:
	go install github.com/swaggo/swag/cmd/swag@latest
	swag init
	go mod tidy

swaggerfast:
	swag init
	go mod tidy

vendor:
	go mod vendor

clean:
	rm -rf asset/dashboard
	rm -rf asset/d2admin

tauridev:
	cd frontend && cargo tauri dev

tauribuild:
	cd frontend && cargo tauri build

updated:
	# go get -u github.com/go-eden/routine

release:
	goreleaser release --rm-dist

xterm:
	cd asset && npm install xterm@3.9.1