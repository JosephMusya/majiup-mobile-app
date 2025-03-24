pipeline {
    agent any

    options {
        timeout(time: 2, unit: 'HOURS')
    }

    environment {
        EXPO_TOKEN = credentials('expo-token')
    }

    stages {
        stage('Checkout from Main Code') {
            steps {
                git branch: 'main', url: 'https://github.com/JosephMusya/majiup-mobile-app' // TODO:: to migrate the project soon
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'pnpm install'
            }
        }

        stage('Authenticate with Expo Token') { //the token is stored in the credentials (expo-token)
            steps {
                // sh 'npx expo login --token $EXPO_TOKEN'
                sh 'npx expo login -p $EXPO_TOKEN'
            }
        }

        stage('Build App with EAS') { // build app
            steps {
                sh 'npx eas build --profile production --platform android --non-interactive --progress plain'
            }
        }

        // stage('Deploy App to Playstore') {
        //     steps {
        //         sh 'npx eas submit -p android --profile production --non-interactive'
        //     }
        // }
    }

    post {
        success {
            echo 'Build Successful!'
        }
        failure {
            echo 'Build Failed!'
        }
    }
}
