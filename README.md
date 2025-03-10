**Start the Backend API**:
   - Ensure you have the latest version of Node.js.
   - Run the following commands to install dependencies and start the API:
     ```bash
     cd server
     npm install
     npm run api
     ```
**Start the client application**
- Run the following commands to install dependencies and start the client application:
     ```bash
     cd client
     npm install
     npm run dev
     ```

**Access the application**
- Open your browser and navigate to `http://localhost:3000` to access the application.

#### Things I'd add
- Responsive design
- May color code the roles for easier differentiation at a glance
- I'd probably try to add a reusable Table component
- Possibly add sorting to the tables
- Add real form validation
- Show a message on the UserTable when:
  - A user is successfully added
  - A user is successfully deleted
  - A user is successfully updated
  - Roles fail to load so we can only show the user's roleId until they are loaded
  - Also just realized that the add user dialog doesn't close when clicked outside/overlay. Would need to fix that :) 
