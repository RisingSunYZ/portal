package com.dragon.portal.util;

import com.dragon.portal.constant.PortalConstant;
import sun.misc.BASE64Encoder;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.Security;

/**
 * 用户中心加密相关操作工具类
 * 
 * @Title:
 * @Description:
 * @Author:wentaoxiang
 * @Since:2016年1月20日 上午9:50:01
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有
 */
public class CryptUtils {

	private static String Algorithm = "DES"; // 定义 加密算法,可用 DES,DESede,Blowfish

	private static byte[] ceacszKey = "4de51dt2tt1e5l".getBytes(); // 密钥

	static {
		Security.addProvider(new com.sun.crypto.provider.SunJCE());
	}

	/**
	 * 生成密钥, 注意此步骤时间比较长
	 * 
	 * @return 密钥的字节数组
	 * @throws Exception
	 */
	public static byte[] getKey() throws Exception {
		KeyGenerator keygen = KeyGenerator.getInstance(Algorithm);
		SecretKey deskey = keygen.generateKey();
		return deskey.getEncoded();
	}

	/**
	 * 加密
	 * 
	 * @param input
	 *            需要加密的字符串的字节数组
	 * @param key
	 *            密钥（字节数组）
	 * @return 加密结果（字节数组）
	 * @throws Exception
	 */
	public static byte[] encode(byte[] input, byte[] key) throws Exception {
		SecretKey deskey = new javax.crypto.spec.SecretKeySpec(key, Algorithm);
		Cipher c1 = Cipher.getInstance(Algorithm);
		c1.init(Cipher.ENCRYPT_MODE, deskey);
		byte[] cipherByte = c1.doFinal(input);
		return cipherByte;
	}

	/**
	 * 解密
	 * 
	 * @param input
	 *            需要解密的字符串的字节数组
	 * @param key
	 *            密钥（字节数组）
	 * @return 解密结果（字节数组）
	 * @throws Exception
	 */
	public static byte[] decode(byte[] input, byte[] key) throws Exception {
		SecretKey deskey = new javax.crypto.spec.SecretKeySpec(key, Algorithm);

		Cipher c1 = Cipher.getInstance(Algorithm);
		c1.init(Cipher.DECRYPT_MODE, deskey);
		byte[] clearByte = c1.doFinal(input);
		return clearByte;
	}

	/**
	 * md5()信息摘要, 不可逆
	 * 
	 * @param input
	 * @return
	 * @throws Exception
	 */
	public static byte[] md5(byte[] input) throws Exception {
		MessageDigest alg = MessageDigest.getInstance("MD5"); // or
		// "SHA-1"
		alg.update(input);
		byte[] digest = alg.digest();
		return digest;
	}

	public static String md5(String str) throws Exception {
		String digest = new String(byte2hex(md5(str.getBytes()))).toLowerCase();
		return digest;
	}

	/**
	 * SHA1加密
	 *
	 * @param input
	 * @return
	 * @throws Exception
	 */
	public static byte[] sha1(byte[] input) throws Exception {
		MessageDigest alg = MessageDigest.getInstance("SHA-1"); // or
																							// "SHA-1"
		alg.update(input);
		byte[] digest = alg.digest();
		return digest;
	}

	public static String sha1(String str) throws Exception {
		String digest = new String(byte2hex(sha1(str.getBytes()))).toLowerCase();
		return digest;
	}

	/**
	 * 字节码转换成16进制字符串
	 *
	 * @param b 字节码
	 *            （字节数组）
	 * @return 16进制字符串
	 */
	public static String byte2hex(byte[] b) {
		String hs = "";
		String stmp = "";
		for (int n = 0; n < b.length; n++) {
			stmp = (Integer.toHexString(b[n] & 0XFF));
			if (stmp.length() == 1)
				hs = hs + "0" + stmp;
			else
				hs = hs + stmp;

			// if (n<b.length-1) hs=hs+":";
		}
		return hs.toUpperCase();
	}

	/**
	 * 16进制字符串转换成字节码
	 * 
	 * @param strHex
	 * @return
	 */
	public static byte[] hex2byte(String strHex) {
		byte[] ret = null;
		try {
			if (strHex.length() > 0 && (strHex.length() % 2) == 0) {
				ret = new byte[strHex.length() / 2];
				for (int i = 0; i < ret.length; i++) {
					String strTmp = strHex.substring(i * 2, (i + 1) * 2);
					ret[i] = Integer.valueOf(strTmp, 16).byteValue();
				}
			}
		} catch (Exception ex) {
			System.err.println(ex);
		}
		return ret;
	}

	// 加密
	public static String encode(String strSrc) {
		String ret = "";
		try {
			byte[] bEncoded = encode(strSrc.getBytes(), ceacszKey);
			ret = byte2hex(bEncoded);
		} catch (Exception ex) {
			ret = "";
			ex.printStackTrace();
		}
		return ret;
	}

	// 解密
	public static String decode(String strCrypt) {
		String ret = "";
		try {
			byte[] bEncoded = hex2byte(strCrypt);
			ret = new String(decode(bEncoded, ceacszKey));
		} catch (Exception ex) {
			ret = "";
		}
		return ret;
	}

	/**
	 * 
	 * @param key
	 *            密钥
	 * @param strSrc
	 * @return
	 */
	public static String encode(String key, String strSrc) {
		String ret = "";
		try {
			byte[] bEncoded = encode(strSrc.getBytes(), key.getBytes());
			ret = byte2hex(bEncoded);
		} catch (Exception ex) {
			ex.printStackTrace();
			ret = "";
		}
		return ret;
	}

	/**
	 * 解密
	 * 
	 * @param key
	 *            密钥
	 * @param strCrypt
	 * @return
	 */
	public static String decode(String key, String strCrypt) {
		String ret = "";
		try {
			byte[] bEncoded = hex2byte(strCrypt);
			ret = new String(decode(bEncoded, key.getBytes()));
		} catch (Exception ex) {
			ret = "";
		}
		return ret;
	}

	public static String getMd5Info(String userNo, String userName) throws Exception {
		String personInfo = userNo + PortalConstant.CRYPT_KEY + userName;
		personInfo = CryptUtils.md5(personInfo);
		return personInfo;
	}

	public static String getCryPasswd(String password) throws Exception {
		String passwordInfo = CryptUtils.md5(password + PortalConstant.CRYPT_KEY);
		passwordInfo = CryptUtils.md5(passwordInfo + PortalConstant.CRYPT_KEY);
		return passwordInfo;
	}
	
	public static String md5EncryptAndBase64(String str) {
		return encodeBase64(md5Encrypt(str));
	}

	private static byte[] md5Encrypt(String encryptStr) {
		try {
			MessageDigest md5 = MessageDigest.getInstance("MD5");
			md5.update(encryptStr.getBytes("utf8"));
			return md5.digest();
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}

	private static String encodeBase64(byte[] b) {
		BASE64Encoder base64Encode = new BASE64Encoder();
		String str = base64Encode.encode(b);
		return str;
	}
	
	/**
	 * 生成加密串，唯一标识锁KEY
	 * @param formData
	 * @param userNo
	 * @return
	 * @Description:
	 * @author xietongjian 2017 下午2:56:08
	 */
	public static String genLockKey(String formData, String userNo){
		StringBuilder builder = new StringBuilder();
		MessageDigest md;
		try {
			md = MessageDigest.getInstance("MD5");
			StringBuffer lockKey = new StringBuffer(""); 
			lockKey.append(userNo);
			lockKey.append(formData);
			md.update( lockKey.toString().getBytes() );
			for ( byte b : md.digest() ){
				builder.append( Integer.toHexString( (b >> 4) & 0xf ) );
				builder.append( Integer.toHexString( b & 0xf ) );
			}
		} catch (NoSuchAlgorithmException e) {
			e.printStackTrace();
		}
		return builder.toString();
	}

	public static void main(String[] args) throws Exception {
		System.out.println(CryptUtils.getCryPasswd("248552"));
	}
}
