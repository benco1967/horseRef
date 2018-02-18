# *Fittings* utilisée dans *bagpipes*
Ce dossier contient les fittings utilisés dans les bagpipes.

## Préchargement du tenant (*tenantLoader*)
le fitting *tenantLoader* permet de précharger le tenant dès lorsqu'un
identifiant est disponible dans les paramètres swagger de l'opération.
Pour utiliser ce fitting il suffit d'ajouter dans la définition de
l'opération le paramètre *x-tenantLoader* et d'indiquer le nom du
paramètre à utiliser pour récupérer l'id du tenant.

### Exemple d'utilisation

#### Ajout du champ *x-tenantLoader* dans le *swagger.yaml*

```yaml
...
paths:
  ...
  /admin/tenants/{tenant}/settings:
    x-swagger-router-controller: tenantsAdmin
    get:
      operationId: getAdminTenantSettings
      x-tenantLoader: tenant
      ...
      parameters:
        - name: tenant
          in: path
          description: Le nom du tenant
          required: true
          type: string
        ...
      responses:
        ...
```
Dans la définition de l'operation on ajoute *x-tenantLoader* en lui
donnant pour valeur le nom du paramètre dans lequel se trouve
l'identifiant du tenant, ici *tenant*.

#### Ajout du *tenantLoader* dans le bagpipe

```yaml
  bagpipes:
    ...
    # pipe for all swagger-node controllers
    swagger_controllers:
      - onError: json_error_handler
      - cors
      - tenantLoader
      - swagger_security
      - _swagger_validate
      - express_compatibility
      - _router
```

#### utilisation du *tenant* dans l'opération

Si l'extraction du tenant se passe bien le tenant est accessible dans la
requête.

Si une erreur est survenue lors de l'extraction (problème de base de
données, tenant inconnu,...) le champ *err* est défini et le tenant est
nul.

```javascript
...
const getParam = require('../helpers/customParams').get;
...
const tenant = getParam(req, "tenant", "value");
const err = getParam(req, "tenant", "err");
// ou
const tenant = req[Symbol.for("tenant")].value;
const err = req[Symbol.for("tenant")].err;
```
