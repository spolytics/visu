
BIN_DIR = node_modules/.bin
WATCHIFY = $(BIN_DIR)/watchify
STANDARD = $(BIN_DIR)/standard

.PHONY: standard
standard:
	$(STANDARD)

.PHONY: watch
watch:
	$(WATCHIFY) docs/index.js \
		--outfile docs/bundle.js \
		--debug \
		--verbose

.PHONY: serve
serve:
	cd docs && python -m SimpleHTTPServer
