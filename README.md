Calendar Web App
================

Single Page Calendar App built using Flask and MongoDB

Setup
-
1.  Install MongoDB.
2.  Initiate a MongoDB Instance using ```mongod --dbpath <path_to_db>``` and using the Mongo Client create a DB ```calendar```
3.  Unzip the folder
4.  ```cd <directory>``` and Run ```pip install -r requirements.txt```.

Steps to Run
-
1.  **Ensure that you have a MongoDB instance running.**
2.  Run using ```python main.py```

Minor Issues
-
1.  The Event Creation Popup suffers from a bug that doesn't allow it to detect if it is overflowing the viewport or not(https://github.com/sandywalker/webui-popover/issues/21). In addition to that it may be very sensitive to clicks on an area of the day cell.
2.  The weather API may take a while to load the weather.
3.  No matter how much I tried I couldn't get the sync and settings buttons to the right of the calendar header.

Notes
-
*   Comments have been included in the code for understanding. 