package com.dragon.portal.rest.controller.common;

import com.dragon.portal.constant.PortalConstant;
import com.dragon.portal.properties.CommonProperties;
import com.dragon.portal.util.BarcodeUtil;
import com.dragon.portal.util.QRCodeUtil;
import com.dragon.tools.common.FileUtils;
import com.dragon.tools.common.ReturnCode;
import com.dragon.tools.common.UUIDGenerator;
import com.dragon.tools.ftp.FtpTools;
import com.dragon.tools.ftp.UploadUtils;
import com.ys.tools.vo.ReturnVo;
import com.ys.ucenter.api.IPersonnelApi;
import com.ys.ucenter.constant.UcenterConstant;
import com.ys.ucenter.model.vo.PersonnelApiVo;
import io.swagger.annotations.*;
import net.coobird.thumbnailator.Thumbnails;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import springfox.documentation.annotations.ApiIgnore;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/rest/portal/file-operation")
@Api(value="文件操作", description = "文件操作", tags={"文件操作 /rest/portal/file-operation"})
public class FileOperationController {
	private static Logger logger = Logger.getLogger(FileOperationController.class);

	@Autowired
	private IPersonnelApi personnelApi;
	
	@Autowired
	private RedisTemplate<String, String> redisTemplate;

	@Autowired
	private CommonProperties commonProperties;

	@Resource
	private FtpTools ftpTools;


	/**
	 * @Author YangZhao
	 * @Description 上传附件
	 * @Date 10:47 2019/4/3
	 * @Param [file, filePath]
	 * @return com.dragon.tools.vo.ReturnVo
	 **/
	@PostMapping(value = "/uploadFile",headers="content-type=multipart/form-data")
	@ApiOperation("上传附件")
	public com.dragon.tools.vo.ReturnVo uploadFile(@ApiParam MultipartFile file, String filePath) {
		String destFilePath = "";
		String fileName = "";
		Boolean result = false;
		try {
			if (null != file) {
				filePath = StringUtils.isBlank(filePath) ? "p" : filePath;
				// FTP上传文件
				String fileExtension = UploadUtils.getExtension(file.getOriginalFilename());
				fileName = UUIDGenerator.generate() + "." + fileExtension;

				String path = "/" + filePath + FileUtils.getDateFmtFilePath() + "/";
				result = ftpTools.uploadFile(file.getInputStream(), fileName, path);
				destFilePath = path + fileName;
			}
			// 文件图片
		} catch (Exception e) {
			e.printStackTrace();
			logger.error("FileOperationController-uploadFile" + e.getMessage());
		}
		com.dragon.tools.vo.ReturnVo returnVO = result?new com.dragon.tools.vo.ReturnVo(ReturnCode.SUCCESS, destFilePath):new com.dragon.tools.vo.ReturnVo(ReturnCode.FAIL, "附件上传失败");

		return returnVO;
	}

	
	/**
	 * 查询人员主数据获取人员头像链接
	 * @param no
	 * @return
	 * @Description:
	 * @author xietongjian 2017 下午5:59:13
	 */
	private String getHeadImg(String no){
		logger.info(no + "从人员主数据中获取图片存入Redis中。");
		try {
			ReturnVo<PersonnelApiVo> returnVo = personnelApi.getPersonnelApiVoByNo(no);
			if(returnVo != null && UcenterConstant.SUCCESS == returnVo.getCode()){
				PersonnelApiVo personnel = returnVo.getData();
				String headImg = PortalConstant.NULL;
				if(null != personnel && StringUtils.isNotBlank(personnel.getHeadImg())){
					headImg = personnel.getHeadImg();
				}
				redisTemplate.opsForValue().set(PortalConstant.USER_HEAD_IMG + no, headImg, PortalConstant.SESSION_INFO_TTL, TimeUnit.DAYS);
				return headImg;
			}
		} catch (Exception e) {
			e.printStackTrace();
			logger.error("查询人员主数据获取人员头像链接出现异常！" + e);
		}
		return "";
	}

	
	
	/**
	 * 功能描述 : 检测当前URL是否可连接或是否有效, 最多连接网络 5 次, 如果 5 次都不成功说明该地址不存在或视为无效地址.
	 * 
	 * @param url
	 *            指定URL网络地址
	 * 
	 * @return String
	 */
	private synchronized String isConnect(String url) {
		int counts = 0;
		URL urlStr;  
		HttpURLConnection connection;  
		int state = -1;  
		String succ = "";  
		if (url == null || url.length() <= 0) {
			return succ;
		}
		while (counts < 3) {
			try {
				urlStr = new URL(url);
				connection = (HttpURLConnection) urlStr.openConnection();
				state = connection.getResponseCode();
				if (state == 200) {
					succ = connection.getURL().toString();
				}
				break;
			} catch (Exception ex) {
				counts++;
				logger.info("【"+url+"】请求失败！:" + counts);
				continue;
			}
		}
		return succ;
	}

	/**
	 * 根据用户工号，获取对应的头像
	 * @param no
	 * @param response
	 * @Description:
	 * @author xietongjian 2017 下午3:54:36
	 */
	@GetMapping("/getPersonHeadImg")
	public void getPersonHeadImg(String no, HttpServletResponse response){
		String headImg = "";
		try {
	    	String redisValue = redisTemplate.opsForValue().get(PortalConstant.USER_HEAD_IMG + no);
	    	if(StringUtils.isBlank(redisValue)){
	    		headImg = getHeadImg(no);
	    	}else{
	    		headImg = redisValue;
	    	}
	    	
			if(StringUtils.isNotBlank(headImg) && !PortalConstant.NULL.equals(headImg)){
				InputStream inStream = null;
				OutputStream os = response.getOutputStream();    
				try {
					String url = commonProperties.getFtpHost() + headImg;
					
					if(StringUtils.isNotBlank(isConnect(url))){
						//按指定大小把图片进行缩和放（会遵循原图高宽比例） 
						//此处把图片压成400×500的缩略图
						URL u = new URL(url);
						Thumbnails.of(u).size(150,150).toOutputStream(os);//变为400*300,遵循原图比例缩或放到400*某个高度
					}
		        } catch (Exception e) {
		            e.printStackTrace();  
		            logger.error("图片压缩异常！" + e);
		        } finally {  
		            try {  
		            	if(inStream != null){
		            		inStream.close();  
		            	}
		                os.close();  
		            } catch (Exception e) {  
		                e.printStackTrace();  
		                logger.error("关闭流异常！" + e);
		            }  
		        }  
			}
		} catch (Exception e) {
			e.printStackTrace();
			logger.error("调用人员主数据查询人员信息的接口异常！" + e);
		}
	}

	 /** 处理图片
	 * @param path
	 * @param response
	 * @Description:
	 * @author xietongjian 2017 上午10:45:37
	 */
	@GetMapping("/filePreview")
	@ApiOperation(value="处理图片", notes="处理图片")
	@ApiImplicitParams({
			@ApiImplicitParam(paramType="query", name = "path", value = "图片文件路径", required = true, dataType = "String"),
			@ApiImplicitParam(paramType="query", name = "quality", value = "输出图片的质量【1-10】", dataType = "int", defaultValue = "1"),
			@ApiImplicitParam(paramType="query", name = "width", value = "输出图片的宽度", dataType = "int", defaultValue = "500"),
			@ApiImplicitParam(paramType="query", name = "height", value = "输出图片的高度", dataType = "int", defaultValue = "500")
	})
	public void filePreview(
			@RequestParam(value = "path") String path,
			@RequestParam(value = "quality") Integer quality,
			@RequestParam(value = "width") Integer width,
			@RequestParam(value = "height") Integer height,
			@ApiIgnore HttpServletResponse response){
		try {
			if(StringUtils.isNotBlank(path) && !PortalConstant.NULL.equals(path)){
				InputStream inStream = null;
				OutputStream os = response.getOutputStream();    
				try {

					String url = path.startsWith("http:")||path.startsWith("https:")?path:commonProperties.getFtpHost()+(path.startsWith("/")?path:"/"+path);
					
					if(StringUtils.isNotBlank(isConnect(url))){
						//按指定大小把图片进行缩和放（会遵循原图高宽比例） 
						//此处把图片压成400×500的缩略图
						URL u = new URL(url);
						float qualityTemp = (float)quality/10;
						Thumbnails.of(u).outputQuality(qualityTemp).size(null == width?500:width, null == height?500:height).toOutputStream(os);//变为400*300,遵循原图比例缩或放到400*某个高度
					}
				} catch (Exception e) {  
					e.printStackTrace();  
					logger.error("图片压缩异常！" + e);
				} finally {  
					try {  
						if(inStream != null){
							inStream.close();  
						}
						os.close();  
					} catch (Exception e) {  
						e.printStackTrace();  
						logger.error("关闭流异常！" + e);
					}  
				}  
			}
		} catch (Exception e) {
			e.printStackTrace();
			logger.error("调用人员主数据查询人员信息的接口异常！" + e);
		}
	}
	
	/**
	 * 根据编码，获取对应的条形码
	 * @param no
	 * @param response
	 * @Description:
	 * @author xietongjian 2017 上午11:42:31
	 */
	@GetMapping("/getBarCode")
	public void getBarCode(String no, HttpServletResponse response){
		try {
			OutputStream os = response.getOutputStream();
			BarcodeUtil.generate(no, os);
			if(os != null){
				os.flush();
				os.close();
			}
		} catch (Exception e) {
			e.printStackTrace();
			logger.error("根据编码，获取对应的条形码接口异常！" + e);
		}
	}
	
	/**
	 * 根据编码，获取对应的二维码
	 * @param no
	 * @param response
	 * @Description:
	 * @author xietongjian 2017 上午11:42:40
	 */
	@GetMapping("/getQRCode")
	public void getQRCode(String no, HttpServletResponse response){
		try {
			OutputStream os = response.getOutputStream();
			QRCodeUtil.generate(no, os);
			if(os != null){
				os.flush();
				os.close();
			}
		} catch (Exception e) {
			logger.error("根据编码，获取对应的二维码异常！" + e);
			e.printStackTrace();
		}
	}
	
	/**
	 * 转换图片流
	 * @param inStream
	 * @return
	 * @throws Exception
	 * @Description:
	 * @author xietongjian 2017 下午3:52:46
	 */
	public static byte[] readInputStream(InputStream inStream) throws Exception{    
	    ByteArrayOutputStream outStream = new ByteArrayOutputStream();    
	    byte[] buffer = new byte[2048];    
	    int len = 0;
	    while( (len=inStream.read(buffer)) != -1 ){    
	        outStream.write(buffer, 0, len);    
	    }    
	    inStream.close();    
	    return outStream.toByteArray();    
	}

	/**
	 * 文件下载
	 * @param path
	 * @param request
	 * @param response
	 * @return
	 * @Description:
	 * @author zhaohaishan 2017年9月13日 上午11:08:09
	 */
	@GetMapping("/download")
	@ApiImplicitParams({
			@ApiImplicitParam(value="文件路径（如http://domain.com/files/test.docx）", name="path", dataType = "String", required = true, paramType = "query"),
			@ApiImplicitParam(value="文件名称（如test.docx）", name="name", dataType = "String", required = true, paramType = "query")
	})
	@ApiOperation(value="文件下载", notes="文件下载")
	public String downloadFile(String path, String name, HttpServletRequest request, HttpServletResponse response) {
		BufferedInputStream bis = null;
		try {
			String ftpHost = commonProperties.getFtpHost();
			String userAgent = request.getHeader("User-Agent");
			String fileName = "";
			//针对IE或者以IE为内核的浏览器：
			if (userAgent.contains("MSIE")||userAgent.contains("Trident")) {
				fileName = java.net.URLEncoder.encode(name, "UTF-8");
			} else {
				//非IE浏览器的处理：
				fileName = new String(name.getBytes("UTF-8"),"ISO-8859-1");
			}
			URL url = new URL(path.startsWith("http:")||path.startsWith("https:")?path:ftpHost+(path.startsWith("/")?path:"/"+path));
			HttpURLConnection conn = (HttpURLConnection) url.openConnection();//利用HttpURLConnection对象,我们可以从网络中获取网页数据.
			conn.setDoInput(true);
			conn.connect();
			InputStream is = conn.getInputStream(); //得到网络返回的输入流
			response.setContentType("application/force-download");// 设置强制下载不打开
			String s1 ="attachment;fileName=\"" + fileName + "\"; filename*=\"utf-8''" + fileName+"\""+";filename*=utf-8''"+fileName;

			response.addHeader("Content-Disposition", s1);// 设置文件名
			byte[] buffer = new byte[1024];
			bis = new BufferedInputStream(is);
			OutputStream os = response.getOutputStream();
			int i = bis.read(buffer);
			while (i != -1) {
				os.write(buffer, 0, i);
				i = bis.read(buffer);
			}
		} catch (Exception e) {
			e.printStackTrace();
			logger.error("下载文件不存在！");
			return "下载文件不存在！";
		} finally {
			if (bis != null) {
				try {
					bis.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
		return null;
	}

}
