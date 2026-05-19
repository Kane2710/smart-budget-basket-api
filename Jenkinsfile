pipeline {
    agent any

    environment {
        APP_NAME = 'smart-budget-basket-api'
        IMAGE_NAME = 'smart-budget-basket-api'
        CONTAINER_NAME = 'smart-budget-basket-api'
        APP_PORT = '3000'
    }

    stages {
        stage('Build') {
            steps {
                echo 'Installing dependencies...'
                bat 'npm.cmd ci'

                echo 'Building Docker image as build artefact...'
                bat 'docker build -t %IMAGE_NAME%:%BUILD_NUMBER% -t %IMAGE_NAME%:latest .'
            }
        }

        stage('Test') {
            steps {
                echo 'Running automated tests with Jest and Supertest and generating coverage...'
                bat 'npm.cmd test'
            }
        }

        stage('Code Quality') {
            steps {
                echo 'Running SonarCloud code quality analysis...'
                withCredentials([string(credentialsId: 'SONAR_TOKEN', variable: 'SONAR_TOKEN')]) {
                    bat 'npx @sonar/scan -Dsonar.token=%SONAR_TOKEN%'
                }
            }
        }

        stage('Security') {
            steps {
                echo 'Running dependency security scan with npm audit...'
                bat 'npm.cmd audit --audit-level=high'
            }
        }

        stage('Deploy') {
            steps {
                echo 'Removing old container if it exists...'
                bat 'docker rm -f %CONTAINER_NAME% || exit /b 0'

                echo 'Deploying application container to local staging environment...'
                bat 'docker run -d -p %APP_PORT%:3000 --name %CONTAINER_NAME% %IMAGE_NAME%:%BUILD_NUMBER%'
            }
        }

        stage('Release') {
            steps {
                echo 'Tagging Docker image as stable release...'
                bat 'docker tag %IMAGE_NAME%:%BUILD_NUMBER% %IMAGE_NAME%:stable'
                bat 'docker images %IMAGE_NAME%'
            }
        }

        stage('Monitoring') {
            steps {
                echo 'Checking application health endpoint after deployment...'
                bat 'powershell -Command "Start-Sleep -Seconds 5; Invoke-RestMethod http://localhost:3000/health"'
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully with 7 stages.'
        }
        failure {
            echo 'Pipeline failed. Check the console output.'
        }
    }
}