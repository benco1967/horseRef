const mongoose = require('mongoose');
/**
 * Retourne un validateur asynchrone (qui retourne une promesse).
 * Le type de rôle est testé en fonction du paramètre.
 * @param forAdm
 * <li>si true teste les rôles parmi : adm, mng, snd, usr
 * <li>si false teste les rôles parmi : mng, snd, usr
 */
const validator = forAdm => groupRoleMapping =>
  new Promise((resolve, reject) => {
    let errMsg = null;
    for (let group in groupRoleMapping) {
      const roles = groupRoleMapping[group];
      if (Array.isArray(roles)) {
        roles.forEach((role, i) => {
          if (errMsg === null && !(forAdm ? /adm|mng|snd|usr/g :  /mng|snd|usr/g).test(role)) {
            errMsg = `for groupRoleMapping/${group}/${i}, the role '${role}' is not valid`;
          }
        });
      }
      else {
        errMsg = `groupRoleMapping/${group}=${roles} should be an array`;
      }
    }
    if (errMsg) {
      reject(errMsg);
    }
    else {
      resolve(true);
    }
  });

/**
 * Liste des rôles du service avec leurs  descriptions
 */
const ROLES = [
  {
    id: "adm",
    label: "admin",
    title: [
      {
        locale: "fr",
        text: "Super administrateur du service"
      }
    ],
    summary: [
      {
        locale: "fr",
        text: "Ce rôle donne accès à la gestion globale du service"
      }
    ]
  },
  {
    id: "mng",
    label: "manager",
    title: [
      {
        locale: "fr",
        text: "Administrateur de tenant"
      }
    ],
    summary: [
      {
        locale: "fr",
        text: "Ce rôle donne accès à la gestion d'un tenant de service"
      }
    ]
  },
  {
    id: "ins",
    label: "instructor",
    title: [
      {
        locale: "fr",
        text: "Moniteur"
      }
    ],
    summary: [
      {
        locale: "fr",
        text: "Ce rôle donne accès au service"
      }
    ]
  },
  {
    id: "usr",
    label: "user",
    title: [
      {
        locale: "fr",
        text: "Utilisateur enregistré"
      }
    ],
    summary: [
      {
        locale: "fr",
        text: "Ce rôle donne accès à l'utilisation au service à l'exception de l'envoi de sms"
      }
    ]
  },
];

module.exports = {
  schema: forAdm => ({
    type: mongoose.Schema.Types.Mixed,
    required: true,
    validate: {
      validator: validator(forAdm),
      message: "{REASON}",
    },
  }),
  validator,
  ROLES,
};
