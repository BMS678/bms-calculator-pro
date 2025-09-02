# Hello Android App

Projet Android minimal (Kotlin) affichant "Hello World".

## Prérequis
- Android Studio (Giraffe+ recommandé)
- JDK 17
- Android SDK (API 34 conseillé)

## Démarrage
1. Ouvrez le dossier `android-app` dans Android Studio
2. Laissez la synchronisation Gradle se terminer
3. Choisissez un appareil (émulateur ou réel) et lancez ▶️

## Ligne de commande
Si vous avez Gradle installé localement (sinon utilisez Android Studio):
```bash
cd android-app
gradle assembleDebug
```

## Détails techniques
- AGP 8.5.2, Kotlin 1.9.24
- compileSdk 34, minSdk 24, targetSdk 34
- UI via layout XML (`activity_main.xml`) et `AppCompatActivity`