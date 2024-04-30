# Liferay Universal Connector
The Liferay Universal Connector is an application designed to facilitate connections between Liferay and external data sources such as databases, Salesforce, Facebook, and external APIs via Swagger files or standard GET APIs.

This application relies on the Liferay proxy object and includes its own backend. The backend provides Liferay with several object entry managers, enabling users to connect their proxy objects seamlessly.

It's important to note that activating the proxy object on your Liferay installation is essential for this application to function properly. Without it, the application will not be able to start.


# Deployment 

please follow the blow steps to deploy Liferay Universal Connector:

- Build the three client extensions available in this workspace:
  - Batch CX: Used to create the required object definition, which is being used to store the connectors configurations
  - UI CX: Used to provide the required User Admin Interface which will allow you to add the connectors
  - Backend CX: Used to manage the required backed logic for the connector.
- Copy the compiled Client Extensions Zip files to your <bundle>/deploy folder

# Configuration

To configure Liferay Universal Connector, please follow the below steps:

- Navigate to Liferay -> Control Panel -> OAuth 2 Administration
- Find the below OAuth Applications:
  - Liferay Universal Connector Etc Node OAuth Application User Agent
  - Liferay Universal Connector Etc Node OAuth Application Server
- Copy the Client ID for the Agent OAuth application and paste it in the application.json inside the backend CX
- Copy the Client ID and Secret for the Server OAuth application and paste it in the application.json inside the backend CX
- Run the backend server by typing the below command 

```bash
npm i
npm run start
```
- Navigate to Liferay -> Applications -> Liferay Universal Connector and follow the wizard steps to create your first connector.



