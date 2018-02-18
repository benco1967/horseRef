# Projet de squelette pour service

Ce projet pourra servir de base pour d'autres projet y est défini
l'architecture autour de node/express/mongo/swagger.

On y retrouve la gestion :
- de l'accès par JWT
- de l'API d'administration du service
- de l'API d'administration des tenants
- de la gestion des rôles
- du mapping des roles fournis par le JWT et ceux disponibles pour le
service
- de l'internationalisation/personnalisation

## Les rôles
trois rôles de base sont définis:
- *administrateur*, il a accès à tous et notamment à l'administration du
service
- *manager*, il ne peut agir qu'au sein d'un tenant et a accès à
l'administration d'un tenant
- *utilisateur*, il n'a accès qu'aux fonctionnalités du tenant mais pas à
son administration

Chacun des ces rôles de base peuvent être scinder en plusieurs sous
rôles donnant des droits plus fin en fonctio des besoins du service.

Lors de l'appel à une méthode de l'API, le JWT fourni a été créé par un
service de type *Account-Management* qui ne connait pas les rôles de
chaque service, mais seulement des rôles génériques associé à la façon
dont le tenant gère ses besoins d'accès. On va par exemple trouver des
rôles comme : *responsable service facturation*, *secrétaire RH*,... ces
rôles doivent être mapper sur les trois définis par le service. Le
*responsable service facturation* sera un *utilisateur* car il ne fait
qu'utiliser le service, tandis que la *secrétaire RH* sera *manager*
car elle devra gérer les droits lors de l'ajout de nouveaux
utilisateurs.
