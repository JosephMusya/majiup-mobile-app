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

        stage('Setup Node.js') {
            steps {
                script {
                    def nodejs = tool name: 'NodeJS', type: 'jenkins.plugins.nodejs.tools.NodeJSInstallation'
                    env.PATH = "${nodejs}/bin:${env.PATH}"
                }
            }
        }

        stage('Install Majiup Mobile App Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Authenticate with Expo Token') { //the token is stored in the credentials (expo-token)
            steps {
                sh 'npx expo login --token $EXPO_TOKEN'
            }
        }

        stage('Build App with EAS') { // build app
            steps {
                sh 'npx eas build --profile production --platform android --non-interactive'
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
