ALl about django setup
to create env for python(backend libraries)(optional)
-> python -m venv env
-> env\Scripts\activate   

run the requirements.txt (if does not present create it, refering the djangoproject: Mind_Matrics-> Mind_Matrics)
-> pip install -r requirements.txt 

create Django project 
-> django-admin startproject Mind_Matrics
-> cd Mind_Matrics
(to check if Django Project(DP) is properly created or not :  python manage.py runserver)


creating Django apps inside Django project
-> python manage.py startapp userauth 
-> python manage.py startapp Video
-> python manage.py startapp Audio
-> python manage.py startapp Diary
-> python manage.py startapp Questionnaire

include the necessary steps in settings.py of Mind_Matrics(DP)
-> include all the 4 imports 
-> AUTH_USER_MODEL = 'userauth.User'
-> include ALLOWED_HOSTS,REST_FRAMEWORK,SIMPLE_JWT
-> include installed_apps, for now include userauth(app) as userauth.apps.UserauthConfig/ userauth can also work
-> database
 just change the database details specific password, and open pgadmin4 and create database manually by name mentioned in the settings.py: 'NAME': 'MentalHealth' if same database exist change the name and create accordingly or delete the existing one and create again.

Now open userauth app
COpy and paste the models.py code
and run this following commands
-> python manage.py makemigrations
-> python manage.py migrate
open pgadmin4 check new tables are being created or not

Copy the same code of views.py, serializers.py and urls.py(both the urls.py)
then -> python manage.py runserver

All about React 
Directly cloned the frontend from Karan
necessary libraries need to be installed:
-> npm install   
-> npm install react-router-dom 
-> npm i react-router    
-> npm install -D tailwindcss postcss autoprefixer
-> npx tailwindcss init   
-> npm install animate.css --save 
-> npm install react-scroll   
-> npm install react-icons  
-> npm install axios react-router-dom jwt-decoder 
-> npm install jwt-decode 

Install: -> npm install react-dropzone
-> pip install gradio_client
-> pip install numpy

Yash changes merged 
New changes add in experienceflow, mediadata, getrandomizedquestions, Video(views.py)

npm install @react-google-maps/api
