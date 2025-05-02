# Installation Guide

<!-- Follow these steps to create a new WordPress instance on WPEngine and set up the NextJS repository. -->

Follow these steps to set up the NextJS locally.


## Prerequisites
- NodeJS <=18


## Cloning the repository
To clone the repository, open your terminal and run the command: `git clone <repository_url>`.

- [Create a new repository](https://github.com/new) using the [nextwptemplate](https://github.com/Made-Together/nextwptemplate) repository as the template.


## ds
- Installing dependencies
- Setting up environment variables
- Running the development server

### WordPress Setup

1. **Create a New Site**
    - [Create a new site in WPEngine](https://my.wpengine.com/accounts/togetheragency/add_site/).
    - Select "Copy an existing environment to a new site" and use [nextwptemplate](https://my.wpengine.com/installs/nextwptemplate) as the environment to copy.
    - Wait for the site to be created.

2. **Log In to the New Site**
    - Go to `/wp-login.php` and [use nextwptemplate details from 1Password](https://start.1password.com/open/i?a=K45NWMQEJZH3PMKXCZJ422Y56E&v=x6plr36kuwupmjzjg7jiayzz2i&i=jqxeu3p7jr664pvde42gkgyloy&h=togetherteam.1password.com).
    - Update the password for the `together` user and add this as a new entry in 1Password.

3. **Update Permalink Settings**
    - Go to `/wp-admin/options-permalink.php`:
        - Check if the production site uses trailing slashes or no trailing slashes and update accordingly.
        - If the production site has a resources area with a different slug, update the permalink to match.
        - Ensure the resources page slug matches the new permalink if changed.

4. **Update General Settings**
    - Go to `/wp-admin/options-general.php`:
        - Update the `Site Title` to the company name.
        - Update the `Site Address (URL)` to `http://localhost:3000`.

### NextJS Setup

1. **Create a New Repository**
    - [Create a new repository](https://github.com/new) using the [nextwptemplate](https://github.com/Made-Together/nextwptemplate) repository as the template.

2. **Clone the Repository**
    - Clone the repository to your local machine:

      ```sh
      git clone <repository-url>
      cd <repository-directory>
      ```

3. **Clean Up Repository**
    - Delete the `/.github/actions/deploy-template-to-wordpress.yml` file and commit the changes:

      ```sh
      rm .github/actions/deploy-template-to-wordpress.yml
      git add .
      git commit -m "Remove deploy template action"
      git push
      ```

4. **Install Dependencies**
    - Install the required dependencies:

      ```sh
      yarn
      ```

5. **Set Up Environment Variables**
    - Duplicate `.env.local.example` to `.env.local`:

      ```sh
      cp .env.local.example .env.local
      ```

    - Update the `NEXT_PUBLIC_WORDPRESS_BASE_URL` value in `.env.local` to your WordPress installation URL.

6. **Run the Development Server**
    - Start the development server:

      ```sh
      yarn develop
      ```

### Notes
- Ensure you have the necessary permissions and access to WPEngine and 1Password before starting.
- Verify all settings and environment variables to avoid common configuration issues.
- Refer to the NextJS and WordPress documentation for additional support if needed.