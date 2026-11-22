# Aide au diagnostic de peau

Petit outil pour les cours d'esthétique : on coche les observations (aspect visuel, aspect palpatoire, tonicité, autres) pour chaque zone du visage, et le site propose un **type** (normale, sèche, grasse, mixte) et un **état** (déshydraté, sensible, mature).

## Fichiers

| Fichier | Rôle |
|---|---|
| `index.html` | Formulaire et structure de la page |
| `styles.css` | Mise en page (une seule version, adaptée téléphone, tablette et ordinateur) |
| `script.js` | Règles de diagnostic et boutons |

## Modifier les règles

Tout est dans la fonction `diagnose()` de `script.js`. Chaque case du formulaire a un `name` dans `index.html` (`_med` = zone médiane, `_lat` = zone latérale) ; ce nom est utilisé tel quel dans les conditions.

## Ajouter une case

1. Ajouter un `<label class="choice">` avec un `name` unique dans `index.html`.
2. Si elle intervient dans les règles, l'ajouter à la liste de `const { ... } = counts;` dans `diagnose()`.

## Publication

Hébergé avec GitHub Pages : tout `push` sur la branche principale met le site à jour.
