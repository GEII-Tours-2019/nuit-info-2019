# nuit-info-2019

Dépot du projet "Les Impédants" pour la nuit de l'info 2019 à Polytech Tours.

Discord : https://discord.gg/pZtYxed

## Plan du README

1. Explication du projet
2. Installation + lien de démo
3. Organisation des dossiers
4. Documentation

---

### 1. Explication du projet

Le projet des Impédants est un projet qui visent à aider les étudiants à trouver des solutions à leurs problèmes administratif.  
Il propose en autre un moteur de recherche associé à une petite IA, qui trouve les meilleurs site selon les mots clés entrer par l'utilisateur.  

Il embarque sous forme de site web :
- un moteur de recherche qui comprend accents, la casse, petite faute de frappes
- la reconnaissance vocale (compatible chrome/webkit seulement pour le moment, par manque de temps)
- Une base de données (110 entrées de site web)
- une interface simple et intuitive, pensée pour tout les utilisateurs.
- Le tout en HTTPS :)

### 2. Installation + liens

Vous pouvez trouver jusqu'au 31 janvier (date garantie) le site web sur cette adresse web : https://osmoze-rp.com .  

Niveau technologie, il utilise :
- Node.js (version 10.x sur notre machine)
- MySQL
- HTML/CSS/JS

Vous pouvez l'installer comme ci-dessous :

```sh
sudo apt-get install nodejs
npm install mysql

cd folder/of/project/cloned/server-file
node main.js
```

### 3. Organisation des dossiers

Le dossier `server-file` contient tout les fichiers serveurs et client

Dedans, vous trouverez le main.js qui est le serveur Node.js, le dossier html/ qui contient les différents version html et les 2 pages actuelles, et le dossier static/ qui contient CSS, image, font, ...

### 4. Documentation

Pour faire la reconnaissance vocale, nous sommes passé par l'API Web Speech :  
https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API

Une fois la recherche lancé, un appel XMLHTTPRequest est envoyé à la page POST /API/get/resultIA avec pour body le contenu du champs de texte.  
Le serveur reçois donc la recherche, et compare les mots clé à la base de données, puis établi un score pour chaque lien selon le nombre de fois qu'il est sorti.  

Le résultat est trié, puis envoyé de nouveau au client en JSON, qui affiche les résultats, ou l'absence de résultat.  

### Plaquette du projet

![shéma](https://raw.githubusercontent.com/GEII-Tours-2019/nuit-info-2019/master/plaquette%20d'infrastructure.png)
