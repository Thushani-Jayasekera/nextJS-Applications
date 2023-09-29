# Build A Fullstack Next.js Application

Choreo is an Internal Developer Platform (IDevP) that allows you to build, deploy, monitor, and manage your cloud-native applications effortlessly.

In this quick start guide, you will explore how to build and deploy a fullstack Next.js application that utilizes Typescript, MYSQL Database, Prisma ORM, Next-Auth, Next-UI and Tailwind CSS.

You will build a simple reading list web application with a sign-in page and functionality to add, delete and view reading lists. You will use Asgardeo, WSO2's Identity as a Service (IDaaS) solution, to secure user authentication to the web application. The application will allow users to sign in and view the reading list. On signing in, a user can view profile details and view readinglists lists. The application will also allow users to sign out of the application.

This guide walks you through the following steps:

- Deploy your web application
- Use Asgardeo as the IDaaS provider to secure user authentication to the web application.

## Prerequisites

Before you try out this guide, complete the following:

1. Create a GitHub repository to save the service implementation. For this guide, you can fork [https://github.com/wso2/choreo-sample-apps](https://github.com/wso2/choreo-sample-apps).
2. If you are signing in to the Choreo Console for the first time, create an organization as follows:

    1. Go to [https://console.choreo.dev/](https://console.choreo.dev/), and sign in using your Google, GitHub, or Microsoft account.
    2. Enter a unique organization name. For example, `Stark Industries`.
    3. Read and accept the privacy policy and terms of use.
    4. Click **Create**.

    This creates the organization and opens the home page of the default project created for you.

    !!! info "Enable Asgardeo as the key manager"

         If you created your organization in Choreo before the 21st of February 2023, and you have not already enabled Asgardeo as the key manager, follow these steps to enable Asgardeo as the default key manager:

         1. In the Choreo Console, go to the top navigation menu and click **Organization**. This takes you to the organization's home page.
         2. In the left navigation menu, click **Settings**.
         3. Click the **API Management** tab and then click **Enable Asgardeo Key Manager**.
         4. In the confirmation dialog that opens, click **Yes**.

## Step 1: Setup the database

#### Step 1.1: Create a database service

1. Login to [Aiven Console](https://console.aiven.io/signup) and select create a new Service.

2. Select MySQL as the service and choose the Free plan.

3. Give the service name as readingList and create a free service.

#### Step 1.2: Setup Prisma and create the database Schema

This step is done to setup Prisma and create the relevant tables in your database.

1. Clone the repository to your local machine.

2. Create a .env file and add `DATABASE_URL={Service URL of the database created above}`

3. Now, you will set up Prisma and connect it to your MySQL database. Therefore, run the above commands in your terminal.

-  Run `npm install prisma --save-dev`

-  Run `npm install @prisma/client`

-  Run `npx prisma generate`

-  Run `npx prisma db push`


## Step 2: Create the Next.js Web Application

Let's deploy a next.js web application to consume the API. This application is designed to personalize the reading lists based on the user ID that it obtains from its identity provider.

#### Step 2.1: Create a web application component

To host the web application in Choreo, you must create a web application component. To create a web application component, follow the steps given below.

1. In the Choreo console, select the project of the reading list application that you created in the previous steps, from the project list located on the header.
2. Click **Create** under the **Component Listing** section to create a new component.
3. On the **Web Application** card, click **Create**.
4. Enter a unique name and a description for the web application. You can enter the name and description given below:

    | **Field**       | **Value**               |
    |-----------------|-------------------------|
    | **Name**        | `Reading List Web App`  |
    | **Description** | `Next.js application for managing reading lists` |

5. Click **Next**.
6. To allow Choreo to connect to your GitHub account, click **Authorize with GitHub**.
7. In the **Connect Repository** pane, enter the following information:

    | **Field**             | **Description**                               |
    |-----------------------|-----------------------------------------------|
    | **GitHub Account**    | Your account                                  |
    | **GitHub Repository** | **`choreo-sample-apps`** |
    | **Branch**            | **`main`**                               |
    | **Build Preset**      | Click **Dockerfile** since the web application is a containerized Next.js application built using a Dockerfile|
    | **Dockerfile Path***              | **`web-apps/NextJs/readingList/Dockerfile`** |
    | **Dockerfile context Path***     | **`web-apps/NextJs/readingList/`**             |
    | **Port** | **`3000`** |

9. Click **Create**. This initializes the service with the implementation from your GitHub repository and takes you to the **Overview** page of the component.

Let's configure the web application to connect to an IdP (For this guide, let's use Asgardeo) to generate an access token for a user.

#### Step 2.2: Configure Asgardeo (IdP) to integrate with your application

Choreo uses Asgardeo as the default identity provider for Choreo applications.

1. Access Asgardeo at [https://console.asgardeo.io/](https://console.asgardeo.io/) and sign in with the same credentials with which you signed in to Choreo.
2. In the Asgardeo Console's left navigation, click **Application**. Click **New Application** then choose **Standard based application**.
3. Provide a name for the application. For example, `readingListApp`, choose **OpenIDConnect** and Register.
4. Click the **Protocol** tab and apply the following changes:

    1. Under **Allowed grant types**, select **Code**.
    2. Select the **Public client** checkbox.
    3. In the **Authorized redirect URLs** field, enter {WebApp URL}/api/auth/callback/asgardeo. E.g http://localhost:3000/api/auth/callback/asgardeo`` and click the **+** icon to add the entry.
    4. In the **Allowed origins** field, add the Web Application URL.
    6. Under **Access Token**, select **JWT** as the **Token type**.
    7. Click **Update**.
5. Click the **User Attributes** tab and apply the following changes:
    1. Select **email** and **username** as Mandatory from the **User Attribute Selection** list.

#### Step 2.3: Deploy the web application component

To deploy the web application component, follow the steps below:

1. In the left menu, click **Deploy**.
2. In the **Build Area** card, select **Deploy** from the split button and click to deploy. 
3. The deployment may take a few minutes to complete. See how to define and read configurations at [Develop a Web Application page](https://wso2.com/choreo/docs/develop-components/develop-a-web-application/#creating-a-web-application).
4. Once you deploy the web application, copy the **Web App URL** from the development environment card.

#### Step 2.4: Configure the web application component

Once the web application component is deployed, you can configure the web application. To configure the web application, follow the steps given below:

1. In the **Environment Card**, click **Manage Configs & Secrets**, which will take you to the window to add configurations. 
2. Create a new configuration, and select **ConfigMap** as config Type and **File Mount** as Mount Type.
3. Give a meaningful config name, add the mount path as `/app/.env` and add the following configurations in the editor:
```
ASGARDEO_CLIENT_ID={Asgardeo client id of the Asgardeo application created}
ASGARDEO_CLIENT_SECRET={Asgardeo client secret of the Asgardeo application created}
ASGARDEO_SCOPES=openid email profile internal_login
ASGARDEO_ORGANIZATION_NAME={org-name}
NEXTAUTH_URL={Web application url copied}
SECRET={a random secret}
NEXTAUTH_SECRET={a random secret}
DATABASE_URL={Service uri of the database connection created in step 1}
```

!!! info

    1. See more details on NEXTAUTH_URL and NEXTAUTH_SECRET configurations at [Next.js Official Documentation] (https://next-auth.js.org/configuration/options)

4. After a few seconds when the deployment is active, navigate to the copied web app URL. You can verify that the web app is successfully hosted.

Next, let's create a user to access the web application.

#### Step 2.5: Create a user in Asgardeo

To sign in to the **readingListApp** application and create private reading lists, the end users require user IDs. End users can self-register these user IDs in Asgardeo or request an Asgardeo user with administrative privileges to register them. For more information, see [Asgardeo Documentation - Manage users](https://wso2.com/asgardeo/docs/guides/users/manage-customers/#onboard-a-user).

In this step, you play the role of an Asgardeo user with administrative privileges who can register user IDs.

To define a user for the **readingListApp** application, follow the steps given below:

1. Go to the [Asgardeo Console](https://console.asgardeo.io/) and click **Users**.
2. On the **Users** page, click **+ New User**.
3. In the **Add User** dialog, enter values for **Username (Email)**, **First Name**, and **Last Name**.
4. Under **Select the method to set the user password**, select **Invite the user to set the user password**, and make sure you select **Invite Via Email**.

5. Click **Finish**.

    Asgardeo will send you an email to set your password.  It will also open your user profile on a separate page.

6. In your user profile, toggle the **Lock User** switch to unlock your profile.
7. In the email you receive from Asgardeo (with the subject **Here is your new account in the organization <ORGANIZATION_ID>**), click **Set Password**.
8. In the **Enter new password** and **Confirm password** fields, enter a password that complies with the given criteria, and then click **Proceed**.

#### Step 2.6: Log in and test the Web application

To test the web application and send requests to the **Reading List Service** REST API via it, follow the steps given below:

1. Access the web application via its web URL mentioned in the web application overview page.
2. Click **Login with Asgardeo**, and sign in with the credentials of a user that you created in Asgardeo.
**Allow**.

Congratulations! You have successfully created Next.js Web Application with a separate backend. You can navigate through pages and view the reading lists and add and delete books.
