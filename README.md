# Settings

> meteor run --settings=settings.json

`settings.json` Sample:

```
{
    "presenceApiSecret": "MYSECRETKEY",
    "purchaseApiSecret": "MYOTHERKEY",
}
```

# Exemple avec curl :

Pour ajouter une présence :
> 'curl --data "key=MYSECRETKEY&email=a@a.fr&date=2015-01-01&amount=0.5" localhost:3000/presence'

key    : clé de l'API
email  : email de la personne présente
date   : date de la présence (aujourd'hui par défaut)
amount : quantité de ticket (1.0 par défaut)


Pour ajouter un achat :
> curl --data "key=MYOTHERKEY&email=a@a.fr&type=tickets&amount=3" localhost:3000/achats'

key    : clé de l'API  
email  : email de l'acheteur  
type   : vaut 'tickets' ou 'abo'  
amount : combien de tickets/abo ont été acheté  
