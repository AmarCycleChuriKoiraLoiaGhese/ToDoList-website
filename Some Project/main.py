#region Imports.

from flask import Flask, render_template, request
import json, os

#endregion

#region App initialisation.

ToDoListApp = Flask('app')
  
# Responsible for giving a route to the main page and displaying the HTML page.
@ToDoListApp.route('/')
def displaySite():
  return render_template('index.html')

#endregion

#region Api GET, PUT.

# Api that handles GET and PUT requests and manipulate JSON file.
@ToDoListApp.route('/api/Tasks', methods=['GET', 'PUT'])

def getJSONfile():

  # Finds path of the project.
  project_path = os.path.realpath(os.path.dirname(__file__))

  # Finds path of the JSON file within the project.
  file_path = os.path.join(project_path, "data", "Tasks.json")

  # GET method.
  if request.method == "GET":
     
     # Opens the file and returns it.
     with open(file_path, 'r') as openfile:
        json_file = json.load(openfile)
     return json_file 
  
  # PUT method.
  elif request.method == "PUT":
     
     message = ''

     # If the data sent is in JSON format...
     if request.is_json:
       
       reqDict = request.get_json() 
       
       # Opens the file and overwrite it completely.
       with open(file_path, 'w') as openfile:
           json.dump(reqDict, openfile)

       # Return an HTTP status code and a message.
       message = 'Success'
       return message, 200
     else:
       # Else return a 400 HTTP status code and a message.
       message = 'Failure'
       return message, 400

#endregion

#region App starting method.

if __name__ == "__main__":
  ToDoListApp.run(host='###.###.###.###', port=0000)

# Note: host and port are filled with random values for security purposes.

#endregion.