# Contributing to WNC Hiking Hub
Thank you for your interest in contributing to **WNC Hiking Hub**! You can see the list of items to work on [here](https://github.com/AnnieMcMahon/wnc-hiking-hub-v3-db/issues). Follow the steps below to get started.

## Set Up

1. **Fork the repository on GitHub**:
    - Name it the same as the original project: `wnc-hiking-hub-v3-db`.

2. **Clone your forked repository**:
   ```bash
   git clone https://github.com/<YOUR-USERNAME>/wnc-hiking-hub-v3-db.git

3. **Navigate to the project folder**:
    ```bash 
    cd wnc-hiking-hub-v3-db

4. **Add the original repository as a remote**:
    ```bash
    git remote add upstream https://github.com/AnnieMcMahon/wnc-hiking-hub-v3-db

5. **Install dependencies**:
    ```bash
    npm install

6. **Create and switch to a new branch**:
    ```bash
    git checkout -b feature/[short-description]

7. **Run the app locally**:
    ```bash
    npm run dev

You are now ready to start working on the app!

## Work on the App
1. **Sync with the latest changes** from the ```main``` branch before starting:

    ```bash
    git fetch upstream
    git merge upstream/main

3. **Make your changes**:

4. **Commit and push** your changes:
    ```bash
    git add .
    git commit -m "Brief description of your changes"
    git push origin feature/[short-description]

5. **Submit a pull request**:
    * Go to **Pull Requests** on GitHub
    * Click **New Pull Request**
    * Compare your branch with ```main``` in the original repository
    * Fill out the Pull Request template
    * Submit your pull request

## Best Practices

When developing: 
* Use meaningful branch names (e.g., ```feature/add-list-partic-#1``` or ```styling/optimize-for-cell-#6```)
* Write clear commit messages (e.g., ```Add a list of participants feature```)
* Run tests and linting before committing changes
* Document new features or changes clearly

When submitting a pull request:
* Provide a clear summary of your changes
* Describe why your changes are necessary
* Include screenshots or testing steps, if applicable
* Address any comments or feedback promptly

## Contact Me
Have any questions or issues? 
* Submit a new [issue](https://github.com/AnnieMcMahon/wnc-hiking-hub-v3-db/issues) on GitHub
* E-mail me: ```anniemcmahon20@gmail.com```
* Join the slack channel: ```wnc-hiking-hub-collaboration```

