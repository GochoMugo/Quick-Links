import json


json_file = './project.json'
raw_readme_file = './raw/README.md'
readme_file = './README.md'

with open(json_file, 'r') as specfics_file:
    specifics = specfics_file.read()
    specifics = json.loads(specifics)
    with open(raw_readme_file, 'r+') as raw_readme_file:
        readme = raw_readme_file.read()
        readme = readme.format(last_updated=specifics['last_updated'])
        with open(readme_file, 'w') as readme_file:
            readme_file.write(readme)
