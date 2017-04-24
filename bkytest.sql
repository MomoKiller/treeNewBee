/*
Navicat MySQL Data Transfer

Source Server         : cc
Source Server Version : 50632
Source Host           : localhost:3306
Source Database       : bkytest

Target Server Type    : MYSQL
Target Server Version : 50632
File Encoding         : 65001

Date: 2016-08-26 17:05:47
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for showlist
-- ----------------------------
DROP TABLE IF EXISTS `showlist`;
CREATE TABLE `showlist` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tKey` varchar(50) DEFAULT NULL,
  `tName` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of showlist
-- ----------------------------
INSERT INTO `showlist` VALUES ('1', 'hell', '野马');
INSERT INTO `showlist` VALUES ('2', 'hell', '野马');

-- ----------------------------
-- Table structure for tadd
-- ----------------------------
DROP TABLE IF EXISTS `tadd`;
CREATE TABLE `tadd` (
  `id` varchar(36) NOT NULL DEFAULT '',
  `tname` varchar(32) DEFAULT NULL,
  `tpwd` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `tname` (`tname`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of tadd
-- ----------------------------
INSERT INTO `tadd` VALUES ('0a3c146e-0e28-41b6-a1e5-568e35a712b3', 'admin', '123');
INSERT INTO `tadd` VALUES ('164112a9-1d01-47c3-9d71-1ff83aa02126', '2', '2a');
INSERT INTO `tadd` VALUES ('38fbc14d-9511-4851-b040-4a23d8e2fb9a', '3', '3');
INSERT INTO `tadd` VALUES ('8eedb008-e404-4c14-899e-15ce46d9cf13', '5', '5');
INSERT INTO `tadd` VALUES ('b3bdcd3a-7b04-4dd8-81cf-e34e67494a44', '7', '7');
INSERT INTO `tadd` VALUES ('be970acb-ff95-4d25-8bd0-48a1139099bc', '6', '6');
INSERT INTO `tadd` VALUES ('c239bdf7-9353-4bdd-8c31-dba041b1a44b', 'test1', '1');
INSERT INTO `tadd` VALUES ('caeded00-1f81-46ac-9c77-f517b03a8c40', '4', '4');
INSERT INTO `tadd` VALUES ('d0956b9f-7598-4ee3-8013-7c28ed4a3d16', 'pkk', '123');
INSERT INTO `tadd` VALUES ('f38b7346-3778-4954-8ccb-3fb5926ff721', '1', '1');

-- ----------------------------
-- Table structure for user_manage
-- ----------------------------
DROP TABLE IF EXISTS `user_manage`;
CREATE TABLE `user_manage` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userName` varchar(32) DEFAULT NULL,
  `userCode` varchar(32) DEFAULT NULL,
  `userAddress` varchar(100) DEFAULT NULL,
  `userContact` varchar(30) DEFAULT NULL,
  `userPassword` varchar(32) DEFAULT NULL,
  `userAccount` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user_manage
-- ----------------------------
INSERT INTO `user_manage` VALUES ('1', '坏孩子的天空', 'ADMIN-FOR-ALL', '上海市-浦东新区-长清路-德州六村-177弄-15号-302室', '13162087871', '123456', 'pkk');
INSERT INTO `user_manage` VALUES ('2', '版本强势英雄', 'user', 'no idear', 'no way', 'no way', 'ua');
