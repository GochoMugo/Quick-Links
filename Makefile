docs:
	@jade jade/ --out . \
		--pretty \
		--obj project.json
	@sass scss/main.scss css/main.css
	@echo 'Docs built/updated...'

clean:
	@- rm -r *.html

.PHONY: docs clean
