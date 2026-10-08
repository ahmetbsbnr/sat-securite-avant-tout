
SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
--  Table structure for `client`
-- ----------------------------
DROP TABLE IF EXISTS `client`;
CREATE TABLE `client` (
  `num_cli` int(11) NOT NULL AUTO_INCREMENT,
  `civ_cli` varchar(4) NOT NULL,
  `nom_cli` varchar(20) NOT NULL,
  `prenom_cli` varchar(20) NOT NULL,
  `tel_cli` varchar(16) DEFAULT NULL,
  `mel_cli` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`num_cli`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `contrat`
-- ----------------------------
DROP TABLE IF EXISTS `contrat`;
CREATE TABLE `contrat` (
  `num_cont` int(11) NOT NULL AUTO_INCREMENT,
  `num_cli` int(11) NOT NULL,
  `date_cont` date NOT NULL,
  `adr_site` varchar(50) NOT NULL,
  `ville_site` varchar(30) NOT NULL,
  `cp_site` varchar(5) NOT NULL,
  `tel_site` varchar(16) NOT NULL,
  PRIMARY KEY (`num_cont`),
  KEY `fk_contrat_cl` (`num_cli`)
) ENGINE=MyISAM AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `intervention`
-- ----------------------------
DROP TABLE IF EXISTS `intervention`;
CREATE TABLE `intervention` (
  `num_interv` int(11) NOT NULL AUTO_INCREMENT,
  `num_cont` int(11) NOT NULL,
  `date_interv` date DEFAULT NULL,
  `objet_interv` varchar(300) DEFAULT NULL,
  `obs_interv` varchar(300) DEFAULT NULL,
  PRIMARY KEY (`num_interv`)
) ENGINE=MyISAM AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `prestation`
-- ----------------------------
DROP TABLE IF EXISTS `prestation`;
CREATE TABLE `prestation` (
  `code_prest` varchar(6) NOT NULL,
  `lib_prest` varchar(50) NOT NULL,
  `tarif_ht` decimal(7,2) NOT NULL,
  PRIMARY KEY (`code_prest`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `utilisation`
-- ----------------------------
DROP TABLE IF EXISTS `utilisation`;
CREATE TABLE `utilisation` (
  `num_interv` int(11) NOT NULL,
  `code_prest` varchar(6) NOT NULL,
  `qte_prest` int(11) NOT NULL,
  PRIMARY KEY (`num_interv`,`code_prest`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records 
-- ----------------------------
INSERT INTO `client` VALUES ('1','M.','CHAPLIN','Mathieu','0606060606','mat@exemple.com'), ('2','M.','STAUB','Fabien','0607070707','fab@exemple.com'), ('3','Mme','RENAULT','Megane','0612345678','megane@me.com'), ('4','M.','SAXO','Faune','0612211221','saxofaune@gmail.com'), ('5','M.','BROS','Mario','0632132121','mario@bros.com'), ('6','M.','GIRARD','Jean','0678451241','girard@gmail.com');
INSERT INTO `contrat` VALUES ('1','1','2019-03-24','1 rue de Mars','Metz','57000','0363524137'), ('2','2','2018-06-16','2 rue des Bois','Thionville','57100','036545698'), ('3','1','2018-10-12','10 rue des Lisières','Nancy','54000','0332321232'), ('4','3','2020-07-04','3 rue de Metz','Metz','57000','0365456964'), ('5','5','2021-10-09','10 rue du Champignon','Boulay','57220','0198745632'), ('6','1','2019-11-27','2c rue de la GrandeForme','Paris','75006','0189745212'), ('7','4','2019-03-09','5 allée du Logis des Vacances','Epinal','88000','0321548596'), ('8','6','2017-05-02','2 rue des Rois','Nancy','57100','0352415689'), ('9','3','2018-12-15','46 avenue de la Mer','Nice','06000','0465456964');
INSERT INTO `intervention` VALUES ('9','6','2026-05-22','changement matériel',''), ('8','8','2025-05-20','panne diverse',''), ('7','3','2025-09-15','installation','aucun problème'), ('6','1','2025-09-10','panne diverse',''), ('5','5','2025-11-02','installation','RAS'), ('4','1','2025-05-26','dégradations volontaires','dégradations multiples'), ('3','3','2025-05-24','mise à  jour',''), ('2','2','2025-05-20','changement matériel',''), ('1','1','2025-05-20','mise à  jour',''), ('10','8','2025-05-20','dégradations volontaires','');
INSERT INTO `prestation` VALUES ('CENTR','centrale','180.00'), ('DGCOD','clavier digicode','50.00'), ('DPLAC','forfait déplacement avec 1ère heure MO','92.00'), ('DTCFM','détecteur de fumée','30.00'), ('DTCOV','détecteur d\'ouverture','28.00'), ('DTCPR','détecteur de présence','25.00'), ('MO','main d\'oeuvre 1/2 heure','75.00'), ('TLCDE','télécommande','30.00');
INSERT INTO `utilisation` VALUES ('1','CENTR','1'), ('1','DTCOV','2'), ('1','MO','1'), ('2','MO','3'), ('2','DTCFM','3'), ('2','DPLAC','1'), ('3','MO','1'), ('4','DTCPR','1'), ('4','MO','2'), ('5','DTCPR','1'), ('6','CENTR','1'), ('7','DGCOD','1'), ('7','DPLAC','1'), ('8','CENTR','1'), ('8','DPLAC','1'), ('8','DTCFM','2'), ('9','DPLAC','1'), ('9','TLCDE','1'), ('10','DPLAC','1'), ('10','DTCOV','1'), ('10','DTCPR','1'), ('10','MO','1');
