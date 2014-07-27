install:
	@make install_cfx
	@make build
	@firefox quicklinks.xpi
	@make clean
	@echo "QuickLinks has been installed."

build:
	@cfx xpi
	@echo "QuickLinks has been built."

download_cfx:
	@wget -q -O cfx.zip https://ftp.mozilla.org/pub/mozilla.org/labs/jetpack/jetpack-sdk-latest.zip
	@mkdir temp cfx
	@unzip -q cfx.zip -d temp
	@cp -r temp/*/. cfx
	@rm -r temp cfx.zip
	@echo "Addon SDK downloaded."

find_cfx:
	if [ ! cfx ] ; then \
		if [ ! -d cfx ] ; then \
			@make download_cfx ; \
			@sudo cp -r cfx /usr/local/lib/ ; \
			@sudo ln -s /usr/local/lib/cfx/bin/cfx /usr/bin/cfx ; \
		fi ; \
	fi ;

install_cfx:
	@make find_cfx > /dev/null
	@echo "Addon SDK installed."

clean:
	@rm -fr cfx quicklinks.xpi
	@echo "It's now clean."

.PHONY: install build download_cfx, find_cfx, install_cfx, clean
