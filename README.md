# Exemple avec curl :

Pour ajouter une présence :
> 'curl --data "key=your_key&email=a@a.fr" localhost:3000/presence'

key  : clé de l'API  
email: email de la personne présence  


Pour ajouter un achat :
> curl --data "key=your_key&email=a@a.fr&type=tickets&amount=3" localhost:3000/achats'

key    : clé de l'API  
email  : email de l'acheteur  
type   : vaut 'tickets' ou 'abo'  
amount : combien de tickets/abo ont été acheté  
