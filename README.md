# PackBuilder

# About
### Inspiration for this Project
Figuring out what you're going to take on a backpacking trip can be hard. That's where PackBuilder comes in! With PackBuilder you can create a database of all your gear, and create a unique pack for each trip.

### Getting started in PackBuilder
There are 3 main components to PackBuilder:
- *My Packs* - This is where you can see all of your existing packs, or create a new pack for upcoming trips.
- *Gear Locker* - You can take a look at all of your existing gear in your gear locker. You can add new gear, edit existing gear, or delete gear you no longer need.
- *Pack View* - This lets you take a look at the contents of a pack. You can add new gear, add gear from your gear locker, remove gear from the pack, or delete a piece of gear entirely. There's also a handy plot at the top of the page that shows you a breakdown of your gear by category.

### Gear Categories
All gear is organized into distinct 10 distinct categories. This [article](https://www.rei.com/learn/expert-advice/backpacking-checklist.html) by REI is the inspiration for the categories used in PackBuilder. (It's also an excellent resource if you don't know what you should bring).
- Backpacking Gear
- Backcountry Kitchen
- Food and Water
- Clothing and Footwear
- Navigation
- Emergency and First Aid
- Health and Hygiene
- Tools and Repair Items
- Backpacking Extras
- Personal Items

# Key Files
## packbuilder (the Django project)
- `Settings.py` Includes various settings for the project including settings for Heroku deployment and API built using Django Rest Framework

## pack (the Django app)
- `models.py` Includes the User, Gear, and Pack models used by the web application
- `serializers.py` A useful file that serializes data so it can be easy used with Django Rest Framework
- `urls.py` Contains urls for user pages as well as API routes
- `views.py` Contains view definitions for user pages as well as logic for API routes

### static >> pack
- `gearlocker.js` Used to fetch data from the API and render all of the gear belonging to the user. Provides ability to add new gear, delete gear, or edit existing gear.
- `mypacks.js` User to fetch data from the API and render all of the packs belonging to the user. Provides ability to add a new pack, delete a pack, or edit an existing pack.
- `pack.js` Used to fetch deata from the API and render the contents of a particular pack belonging to the user. Renders a plot that shows a breakdown of gear weight by category, provides the ability to add new gear, add existing gear from your gear locker, remove gear from the pack without deleting it, and deleting gear.
- `style.css` Contains a few style elements and background for the app.

### templates >> pack
- `layout.html` The basis for all other html pages in this folder.
- various other html pages

# How to run the application
You can try the application yourself at [https://packbuilder.herokuapp.com/](https://packbuilder.herokuapp.com/).

Or if you prefer to run it locally, you can:
1. Clone this repository
2. Create a virtual environment
3. run `pip install requirements.txt` to install the required dependencies
4. run `python manage.py makemigrations`
5. run `python manage.py migrate` to apply the migrations
6. run `python manage.py runserver` to start the app up locally

# Future Improvements
### Features
- Add a social element to the page that allows users to post their packs publicly and request "shakedowns" from other users. This will require the addition of another page along with the ability for users to comment on packs.
- Add sortable tables.
- Make tables more easily editable.
- Fix the display of the plot on the *Pack View* page.
- Add the ability to specify a quantity of each piece of gear in the pack (useful for food items).
- Add the ability to search and filter existing gear more quickly.
- Add suggestions for required gear for each pack.

### Codebase
- Update JavaScript to include React. React components would probably be very useful for rendering the various tables and plot in the website. IT would also make sorting and filtering much easier.
- More deliberately crafted API routes would help reduce number of API calls.

# If you've made it this far...
### Thanks for reading :)
