# poster
## Installation
* `make virtualenv`
* `git clone https://github.com/wolf-ik/poster`
* `cd poster`
* `pip install -r requirements.txt`
* `bower install`
* `fill poster/settings_production_simple.py and rename to poster/settings_production.py`
* `python manage.py makemigration`
* `python manage.py migrate`
* `and finally, you must configure the sphinx`

## Usage
* `cd poster`
* `python manage.py runserver`
* `python real-time-comments/real-time-comments.py`
