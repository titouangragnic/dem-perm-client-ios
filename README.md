# dem-perm-client-ios

## Sync automatique vers le repo principal (tag → PR)

Quand un tag `v*` est poussé, le workflow `.github/workflows/tag-to-pr.yml` crée une branche dans le repo principal et ouvre une PR qui contient une copie miroir des dossiers suivants :

- `docs/`  → `docs/client/ios/`
- `src/`   → `src/client/ios/`

Remarques courtes :
- Seuls les contenus de `docs/` et `src/` sont actuellement synchronisés.
- Le workflow vérifie que le tag pointe sur un commit contenu dans `origin/main` ; sinon il s'arrête proprement.
- La copie est faite en miroir (suppression incluse) via `rsync --delete`.

Backend mocker :
- Ne placez PAS le backend mocker sous `src/` si vous ne voulez pas qu'il soit poussé automatiquement vers le repo principal. Créez-le dans un dossier séparé à la racine (par ex. `mock-backend/`) pour garder le contrôle et l'ajouter explicitement au workflow si nécessaire.

Repo principal cible :
- Nom : `demperm`
- URL : https://github.com/oricou/demperm
- Ce repo est public.
