docs:
	@jade raw/ --out . \
		--obj project.json
	@python update.py
	@echo 'Docs built/updated...'
