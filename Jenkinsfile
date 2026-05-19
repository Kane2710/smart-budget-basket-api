pipeline {
    agent any

    environment {
        APP_NAME = 'smart-budget-basket-api'
        IMAGE_NAME = 'smart-budget-basket-api'
        IMAGE_TAG = '1.0'
        CONTAINER_NAME = 'smart-budget-basket-api'
        APP_PORT = '3000'
    }

    stages {
        stage('Build') {
            steps {
                echo 'Installing dependencies...'
                bat 'npm.cmd ci'

                echo 'Building Docker image...'
                bat 'docker build -t %IMAGE_NAME%:%IMAGE_TAG% .'
            }
        }

        stage('Test') {
            steps {
                echo 'Running automated tests with Jest and Supertest...'
                bat 'npm.cmd test'
            }
        }

        stage('Deploy') {
            steps {
                echo 'Removing old container if it exists...'
                bat 'docker rm -f %CONTAINER_NAME% || exit /b 0'

                echo 'Deploying application container...'
                bat 'docker run -d -p %APP_PORT%:3000 --name %CONTAINER_NAME% %IMAGE_NAME%:%IMAGE_TAG%'
            }
        }

        stage('Monitoring') {
            steps {
                echo 'Checking application health endpoint...'
                bat 'powershell -Command "Start-Sleep -Seconds 5; Invoke-RestMethod http://localhost:3000/health"'
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully.'
        }
        failure {
            echo 'Pipeline failed. Check the console output.'
        }
    }
}