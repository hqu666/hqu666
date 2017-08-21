using Microsoft.Win32;          ///WebBrowserコントロールを配置すると、IEのバージョン 7をIE11の Edgeモードに変更///
using System;
using System.Text.RegularExpressions;         ///WebBrowserコントロールを配置すると、IEのバージョン 7をIE11の Edgeモードに変更///
using System.IO;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Management;    // 参照設定に追加を忘れずに
							//using System.Object;
							//using System.MarshalByRefObject;
							//using System.ComponentModel.Component;
							//using System.Management.ManagementBaseObject;
							//using System.Management.ManagementObject;

namespace WindowsFormsApp1
{
	public partial class Form1 : Form
	{
		Microsoft.Win32.RegistryKey regkey = Microsoft.Win32.Registry.CurrentUser.CreateSubKey( FEATURE_BROWSER_EMULATION );
		const string FEATURE_BROWSER_EMULATION = @"Software\Microsoft\Internet Explorer\Main\FeatureControl\FEATURE_BROWSER_EMULATION";
		string process_name = System.Diagnostics.Process.GetCurrentProcess().ProcessName + ".exe";
		string process_dbg_name = System.Diagnostics.Process.GetCurrentProcess().ProcessName + ".vshost.exe";

		string[] systemFiles = new string[] { "RECYCLE", ".bak", ".bdmv", ".blf", ".BIN", ".cab",  ".cfg",  ".cmd",".css",  ".dat",".dll",
												".inf",  ".inf", ".ini", ".lsi", ".iso",  ".lst", ".jar",  ".log", ".lock",".mis",
												".mni",".MARKER",  ".mbr", ".manifest",
											  ".properties",".pnf" ,  ".prx", ".scr", ".settings",  ".so",  ".sys",  ".xml", ".exe"};
		string[] videoFiles = new string[] { ".mov", ".qt", ".mpg",".mpeg",  ".mp4",  ".m1v", ".mp2", ".mpa",".mpe",".m3u",
												".webm",  ".ogg",  ".3gp",  ".3g2",  ".asf",  ".asx",
												".m2ts",".dvr-ms",".ivf",".wax",".wmv", ".wvx",  ".wm",  ".wmx",  ".wmz",  ".swf", ".flv", };
		string[] imageFiles = new string[] { ".jpg", ".jpeg", ".gif", ".png", ".tif", ".ico", ".bmp" };
		string[] audioFiles = new string[] { ".adt",  ".adts", ".aif",  ".aifc", ".aiff", ".au", ".snd", ".cda",
												".mp3", ".m4a", ".aac", ".ogg", ".mid", ".midi", ".rmi", ".ra", ".flac", ".wax", ".wma", ".wav" };
		string[] textFiles = new string[] { ".txt", ".html", ".htm", ".xhtml", ".xml", ".rss", ".xml", ".css", ".js", ".vbs", ".cgi", ".php" };
		string[] applicationFiles = new string[] { ".zip", ".pdf", ".doc", ".xls", ".wpl", ".wmd", ".wms", ".wmz", ".wmd" };
		/////https://support.microsoft.com/ja-jp/help/316992/file-types-supported-by-windows-media-player

		public Form1()
		{
			InitializeComponent();
			///WebBrowserコントロールを配置すると、IEのバージョン 7をIE11の Edgeモードに変更//http://blog.livedoor.jp/tkarasuma/archives/1036522520.html
			regkey.SetValue( process_name, 11001, Microsoft.Win32.RegistryValueKind.DWord );
			regkey.SetValue( process_dbg_name, 11001, Microsoft.Win32.RegistryValueKind.DWord );
			//	webBrowser1.Navigate( "http://www.useragentstring.com/" );

		}

		private void Form1_FormClosing(object sender, FormClosingEventArgs e)
		{
			regkey.DeleteValue( process_name );
			regkey.DeleteValue( process_dbg_name );
			regkey.Close();
		}

		private void Form1_Load(object sender, EventArgs e)
		{
			fileTree.ImageList = this.imageList1;   //☆treeView1では設定できなかった
			MakeDriveList();
			//	flowLayoutPanel1.AutoSize = true;
			//flowLayoutPanel1.AutoSizeMode = AutoSizeMode.GrowAndShrink;
			//	this.Width = Screen.GetBounds( this ).Width / 2;
			//	this.Height = Screen.GetBounds( this ).Height / 2;
			//		webBrowser1.AutoSize = true;
			//webBrowser1.AutoScrollOffset= { X = 0 Y = 0};  
			/*		    false   bool
																			  +AutoScrollOffset    { X = 0 Y = 0}
																						  System.Drawing.Point*/

		}

		/*		private void Form1_ResizeEnd(object sender, EventArgs e)
				{
					string TAG = "[Form1_ResizeEnd]";
					string dbMsg = TAG;

					ReSizeViews();
					myLog( dbMsg );
				}*/
		/// <summary>
		/// /////////////////////////////////////////////////////////////////////////////////////////////////////Formイベント/////
		/// </summary>
		/// <param name="sender"></param>
		/// <param name="e"></param>
		private void treeView1_BeforeExpand(object sender, TreeViewCancelEventArgs e)
		{
			string TAG = "[treeView1_BeforeExpand]";
			string dbMsg = TAG;
			//	dbMsg += "sender=" + sender;
			//	dbMsg += "e=" + e;
			try {
				TreeNode tn = e.Node;//, tn2;
				string sarchDir = tn.Text;//展開するノードのフルパスを取得		FullPath だとM:\\DL
				dbMsg += ",sarchDir=" + sarchDir;
				/*		string motoPass = passNameLabel.Text + "";
						dbMsg += ",motoPass=" + motoPass;
						if (motoPass != "") {
							sarchDir = motoPass + sarchDir;// + Path.DirectorySeparatorChar
						} else if (0 < motoPass.IndexOf( ":", StringComparison.OrdinalIgnoreCase )) {
							sarchDir = tn.Text;
						}
						dbMsg += ">sarchDir>" + sarchDir;
						passNameLabel.Text = sarchDir;
						*/
				tn.Nodes.Clear();
				//	folderItemListUp( sarchDir, tn );

				/*
								tn.Nodes.Clear();
								di = new DirectoryInfo( sarchDir );//ディレクトリ一覧を取得
								//string sarchDir = di.Name;
								myLog( dbMsg );
								foreach (FileInfo fi in di.GetFiles(  )) {
									tn2 = new TreeNode( fi.Name, 3, 3 );
									string rfileName = fi.Name;
									rfileName = rfileName.Replace( sarchDir,"" );
									dbMsg += ",rfileName=" + rfileName;
									tn.Nodes.Add( rfileName );
								}
								myLog( dbMsg );
								foreach (DirectoryInfo d2 in di.GetDirectories(  )) {
									tn2 = new TreeNode( d2.Name, 1, 2 );
									string rfolereName = d2.Name;
									 rfolereName = rfolereName.Replace( sarchDir + Path.DirectorySeparatorChar, "" );
									dbMsg += ",rfolereName=" + rfolereName;
									tn.Nodes.Add( rfolereName );
									folderItemListUp( d2.Name, tn2 );
									//	tn2.Nodes.Add( "..." );
								}
								*/
				myLog( dbMsg );
			} catch (Exception er) {
				Console.WriteLine( TAG + "でエラー発生" + er.Message + ";" + dbMsg );
			}
		}       //ノードを展開しようとしているときに発生するイベント

		/// <summary>
		/// ファイルクリック
		/// </summary>
		/// <param name="sender"></param>
		/// <param name="e"></param>	
		private void treeView1_AfterSelect(object sender, TreeViewEventArgs e)//NodeMouseClickが利かなかった
		{
			string TAG = "[treeView1_AfterSelect]";
			string dbMsg = TAG;
			try {
				//		dbMsg += "sender=" + sender;                    //sender=	常にSystem.Windows.Forms.TreeView, Nodes.Count: 5, Nodes[0]: TreeNode: C:\,
				//		dbMsg += ",e=" + e;                             //e=		常にSystem.Windows.Forms.TreeViewEventArgs,
				typeName.Text = "";
				mineType.Text = "";
				TreeNode selectNode = e.Node;
				string selectItem = selectNode.Text;
				dbMsg += ",selectItem=" + selectItem;
				string fullPathName = selectNode.FullPath;  //selectItem;
															/*		TreeNode selectParent = selectNode.Parent;
																	while (selectParent != null) {                                  //親ノードが無くなるまで
																		string parentText = selectParent.Text;                      //
																		if (0 < parentText.IndexOf( Path.DirectorySeparatorChar + "", StringComparison.OrdinalIgnoreCase )) {
																			fullPathName = parentText + fullPathName;
																		} else {
																			fullPathName = parentText + Path.DirectorySeparatorChar + fullPathName;
																		}
																		selectParent = selectParent.Parent;
																	}*/
				dbMsg += ",fullPathName=" + fullPathName;
				FileInfo fi = new FileInfo( fullPathName );
				String infoStr = ",Exists;";
				infoStr += fi.Exists;
				fileinfo.Text = infoStr;
				string fullName = fi.FullName;
				infoStr += ",絶対パス;" + fullName;
				infoStr += ",親ディレクトリ;" + fi.Directory;//   
				passNameLabel.Text = fi.DirectoryName;    //親ディレクトリ名
				fileNameLabel.Text = fi.Name;//ファイル名= selectItem;
				lastWriteTime.Text = fi.LastWriteTime.ToString();//更新
				creationTime.Text = fi.CreationTime.ToString();//作成
				lastAccessTime.Text = fi.LastAccessTime.ToString();//アクセス
				rExtension.Text = fi.Extension.ToString();//拡張子
														  //		int32 fileLength = fi.Length*1;
				dbMsg += ",infoStr=" + infoStr;                             //infoStr=,Exists;False,拡張子;作成;2012/11/04 3:56:33,アクセス;2012/11/04 3:56:33,絶対パス;I:\Dtop,親ディレクトリ;I:\

				string fileAttributes = fi.Attributes.ToString();
				dbMsg += ",Attributes=" + fileAttributes;
				dbMsg += ",Directory.Exists=" + Directory.Exists( fullName );                             //infoStr=,Exists;False,拡張子;作成;2012/11/04 3:56:33,アクセス;2012/11/04 3:56:33,絶対パス;I:\Dtop,親ディレクトリ;I:\
				myLog( dbMsg );
				if (fi.Exists) {                //Attributes=Archive
					if (rExtension.Text != "") {
						fileLength.Text = fi.Length.ToString();//ファイルサイズ
						makeWebSouce( fullName );
					}
				} else if (Directory.Exists( fullName )) {                               //フォルダの場合	(		fileAttributes == "Directory"
					fileLength.Text = "";//ファイルサイズ
										 //			TreeNode tNode = e.Node.Nodes;//new TreeNode( selectItem, selectIindex, 0 );
					folderItemListUp( fullName, e.Node );
				}
			} catch (Exception er) {
				Console.WriteLine( TAG + "でエラー発生" + er.Message + ";" + dbMsg );
			}
		}

		private void folderItemListUp(string sarchDir, TreeNode tNode)//, string sarchTyp
		{
			string TAG = "[folderItemListUp]";
			string dbMsg = TAG;
			try {
				dbMsg += "sarchDir=" + sarchDir;                    //sender=System.Windows.Forms.TreeView, Nodes.Count: 5, Nodes[0]: TreeNode: C:\,
				dbMsg += ",tNode=" + tNode;                             //e=System.Windows.Forms.TreeViewEventArgs,
				dbMsg += ",Nodes=" + tNode.Nodes.ToString();
				tNode.Nodes.Clear();

				string[] files = Directory.GetFiles( sarchDir );        //		sarchDir	"C:\\\\マイナンバー.pdf"	string	☆sarchDir = "\\2013.m3u"でフルパスになっていない
				if (files != null) {
					foreach (string fileName in files) {
						string[] extStrs = fileName.Split( '.' );
						string extentionStr = "." + extStrs[extStrs.Length - 1].ToLower();
						dbMsg += "\n拡張子=" + extentionStr;
						if (-1 < Array.IndexOf( systemFiles, extentionStr ) ||
							0 < fileName.IndexOf( "BOOTNXT", StringComparison.OrdinalIgnoreCase ) ||
							0 < fileName.IndexOf( "-ms", StringComparison.OrdinalIgnoreCase ) ||
							0 < fileName.IndexOf( "RECYCLE", StringComparison.OrdinalIgnoreCase )
							) {
						} else {
							int iconType = 2;
							if (-1 < Array.IndexOf( videoFiles, extentionStr )) {
								iconType = 3;
							} else if (-1 < Array.IndexOf( imageFiles, extentionStr )) {
								iconType = 4;
							} else if (-1 < Array.IndexOf( audioFiles, extentionStr )) {
								iconType = 5;
							} else if (-1 < Array.IndexOf( textFiles, extentionStr )) {
								iconType = 2;
							}
							dbMsg += ",iconType=" + iconType;
							string rfileName = fileName.Replace( sarchDir, "" );
							rfileName = rfileName.Replace( Path.DirectorySeparatorChar + "", "" );
							dbMsg += ",file=" + rfileName;
							tNode.Nodes.Add( fileName, rfileName, iconType, iconType );
						}
					}
				}
				string[] foleres = Directory.GetDirectories( sarchDir );//
				if (foleres != null) {
					foreach (string folereName in foleres) {
						if (-1 < folereName.IndexOf( "RECYCLE", StringComparison.OrdinalIgnoreCase ) ||
							-1 < folereName.IndexOf( "System Vol", StringComparison.OrdinalIgnoreCase )) {
						} else {
							string rfolereName = folereName.Replace( sarchDir, "" );// + 
							rfolereName = rfolereName.Replace( Path.DirectorySeparatorChar + "", "" );
							dbMsg += ",foler=" + rfolereName;
							tNode.Nodes.Add( folereName, rfolereName, 1, 1 );
						}
					}           //ListBox1に結果を表示する
				}
				//		myLog( dbMsg );
			} catch (UnauthorizedAccessException UAEx) {
				Console.WriteLine( TAG + "で" + UAEx.Message + "発生;" + dbMsg );
			} catch (PathTooLongException PathEx) {
				Console.WriteLine( TAG + "で" + PathEx.Message + "発生;" + dbMsg );
			} catch (Exception er) {
				Console.WriteLine( TAG + "でエラー発生" + er.Message + ";" + dbMsg );
			}
		}       //フォルダの中身をリストアップ


		private void listBox1_SelectedIndexChanged(object sender, EventArgs e)
		{
			string selectItem = listBox1.SelectedItem.ToString();
			FileInfo fi = new FileInfo( selectItem );
			String infoStr = ",Exists;";
			infoStr += fi.Exists;
			infoStr += ",拡張子;";
			infoStr += fi.Extension;
			infoStr += "作成;";
			infoStr += fi.CreationTime;
			infoStr += ",アクセス;";
			infoStr += fi.LastAccessTime;
			infoStr += ",更新;";
			infoStr += fi.LastWriteTime;
			if (fi.Exists) {
				infoStr += ",ファイルサイズ;";
				infoStr += fi.Length;
			} else {
				makeFolderList( selectItem );
			}
			infoStr += ",絶対パス;";
			infoStr += fi.FullName;//       
			infoStr += ",ファイル名;";
			infoStr += fi.Name;
			infoStr += ",親ディレクトリ;";
			infoStr += fi.Directory;//     
			infoStr += ",親ディレクトリ名;";
			infoStr += fi.DirectoryName;
			fileinfo.Text = infoStr;
		}           //リストアイテムのクリック

		private void webBrowser1_DocumentCompleted(object sender, WebBrowserDocumentCompletedEventArgs e)
		{
			string TAG = "[webBrowser1_DocumentCompleted]";
			string dbMsg = TAG;
			//	ReSizeViews();
		}

		private void comboBox1_SelectedIndexChanged(object sender, EventArgs e)
		{
			string selectDrive = comboBox1.SelectedItem.ToString();
			listBox1.Items.Clear();
			makeFolderList( selectDrive );
		}           //ドライブセレクト

		private void makeFolderList(string sarchDir)//, string sarchTyp
		{
			try {
				string[] files = Directory.GetFiles( sarchDir );
				if (files != null) {
					foreach (string fileName in files) {
						if (-1 < fileName.IndexOf( "RECYCLE.BIN", StringComparison.OrdinalIgnoreCase )) {
						} else {

							string rfileName = fileName.Replace( sarchDir, "" );
							listBox1.Items.Add( rfileName );      //ListBox1に結果を表示する
						}
					}
				}
				string[] foleres = Directory.GetDirectories( sarchDir );//
				if (foleres != null) {
					foreach (string folereName in foleres) {
						if (-1 < folereName.IndexOf( "RECYCLE", StringComparison.OrdinalIgnoreCase ) ||
							-1 < folereName.IndexOf( "System Vol", StringComparison.OrdinalIgnoreCase )
							) { } else {
							listBox1.Items.Add( folereName );
							//        makeFolderList(folereName);
						}
					}           //ListBox1に結果を表示する

				}
			} catch (UnauthorizedAccessException UAEx) {
				Console.WriteLine( UAEx.Message );
			} catch (PathTooLongException PathEx) {
				Console.WriteLine( PathEx.Message );
			}

		}       //ファイルリストアップ

		private void makeFileList(string sarchDir, string sarchType)
		{
			string[] files = Directory.GetFiles( "c:\\" );
			foreach (string fileName in files) {
				listBox1.Items.Add( fileName );
			}           //ListBox1に結果を表示する

			//     System.IO.DirectoryInfo di = new System.IO.DirectoryInfo(sarchDir);
			//     System.IO.FileInfo[] files =di.GetFiles(sarchType, System.IO.SearchOption.AllDirectories);
			//        foreach (System.IO.FileInfo f in files)
			//       {
			//           listBox1.Items.Add(f.FullName);
			//       }           //ListBox1に結果を表示する

			//以下2行でも同様      https://dobon.net/vb/dotnet/file/getfiles.html
			//            string[] files = System.IO.Directory.GetFiles( sarchDir, sarchType, System.IO.SearchOption.AllDirectories);           //"C:\test"以下のファイルをすべて取得する
			//         listBox1.Items.AddRange(files);           //ListBox1に結果を表示する
		}       //ファイルリストアップ

		private void MakeDriveList()
		{
			//		ManagementObject mo = new ManagementObject();

			TreeNode tn;
			//	fileTree.ImageIndex =2;
			//	fileTree.SelectedImageIndex = 0;

			foreach (DriveInfo drive in DriveInfo.GetDrives())//http://www.atmarkit.co.jp/fdotnet/dotnettips/557driveinfo/driveinfo.html
			{
				string driveNames = drive.Name; // ドライブ名
				if (drive.IsReady) { // ドライブの準備はOK？
					comboBox1.Items.Add( driveNames ); //comboBoxに結果を表示する
													   //         Console.WriteLine("\t{0}\t{1}\t{2}",
													   //           drive.DriveFormat,  // フォーマット
													   //           drive.DriveType,    // 種類
													   //           drive.VolumeLabel); // ボリュームラベル
													   //	tn = new TreeNode( driveNames, 0, 0 );//ノードにドライブアイコンを設定
					tn = new TreeNode( driveNames, 0, 0 );
					//		tn.ImageIndex = 1;          //folder_close_icon.png
					fileTree.Nodes.Add( tn );//親ノードにドライブを設定
					folderItemListUp( driveNames, tn );
					tn.ImageIndex = 0;          //hd_icon.png

				}
			}
			comboBox1.SelectedIndex = 3;

		}//使用可能なドライブリスト取得

		////ファイル操作////////////////////////////////////////////////////////////////////
		public string GetFileTypeStr(string checkFileName)
		{
			string TAG = "[GetFileTypeStr]";
			string dbMsg = TAG;
			//	try {
			string retType = "";
			string retMIME = "";
			string[] extStrs = checkFileName.Split( '.' );
			string extentionStr = "." + extStrs[extStrs.Length - 1].ToLower();
			dbMsg += "\n拡張子=" + extentionStr;
			if (-1 < extentionStr.IndexOf( ".mov", StringComparison.OrdinalIgnoreCase ) ||
				-1 < extentionStr.IndexOf( ".qt", StringComparison.OrdinalIgnoreCase )) {
				retType = "video";
				retMIME = "video/quicktime";
			} else if (-1 < extentionStr.IndexOf( ".mpg", StringComparison.OrdinalIgnoreCase ) ||
				-1 < extentionStr.IndexOf( ".mpeg", StringComparison.OrdinalIgnoreCase )) {
				retType = "video";
				retMIME = "video/mpeg";
			} else if (-1 < extentionStr.IndexOf( ".mp4", StringComparison.OrdinalIgnoreCase )) {
				retType = "video";
				retMIME = "video/mp4";        //ver12:MP4 ビデオ ファイル 
			} else if (-1 < extentionStr.IndexOf( ".webm", StringComparison.OrdinalIgnoreCase )) {
				retType = "video";
				retMIME = "video/webm";
			} else if (-1 < extentionStr.IndexOf( ".ogv", StringComparison.OrdinalIgnoreCase )) {
				retType = "video";
				retMIME = "video/ogv";
			} else if (-1 < extentionStr.IndexOf( ".avi", StringComparison.OrdinalIgnoreCase )) {
				retType = "video";
				retMIME = "video/x-msvideo";
			} else if (-1 < extentionStr.IndexOf( ".3gp", StringComparison.OrdinalIgnoreCase )) {
				retType = "video";
				retMIME = "video/3gpp";     //audio/3gpp
			} else if (-1 < extentionStr.IndexOf( ".3g2", StringComparison.OrdinalIgnoreCase )) {
				retType = "video";
				retMIME = "video/3gpp2";            //audio/3gpp2
			} else if (-1 < extentionStr.IndexOf( ".asf", StringComparison.OrdinalIgnoreCase )) {
				retType = "video";
				retMIME = "video/x-ms-asf";
			} else if (-1 < extentionStr.IndexOf( ".asx", StringComparison.OrdinalIgnoreCase )) {
				retType = "video";
				retMIME = "video/x-ms-asf";   //ver9:Windows Media メタファイル 
			} else if (-1 < extentionStr.IndexOf( ".wax", StringComparison.OrdinalIgnoreCase )) {
				retType = "video";   //ver9:Windows Media メタファイル 
			} else if (-1 < extentionStr.IndexOf( ".wmv", StringComparison.OrdinalIgnoreCase )) {
				retMIME = "video/x-ms-wmv";      //ver9:Windows Media 形式
				retType = "video";
			} else if (-1 < extentionStr.IndexOf( ".wvx", StringComparison.OrdinalIgnoreCase )) {
				retType = "video";
				retMIME = "video/x-ms-wvx";       //ver9:Windows Media メタファイル 
			} else if (-1 < extentionStr.IndexOf( ".wmx", StringComparison.OrdinalIgnoreCase )) {
				retType = "video";
				retMIME = "video/x-ms-wmx";       //ver9:Windows Media メタファイル 
			} else if (-1 < extentionStr.IndexOf( ".wmz", StringComparison.OrdinalIgnoreCase )) {
				retType = "video";
				retMIME = "application/x-ms-wmz";
			} else if (-1 < extentionStr.IndexOf( ".wmd", StringComparison.OrdinalIgnoreCase )) {
				retType = "video";
				retMIME = "application/x-ms-wmd";
			} else if (-1 < extentionStr.IndexOf( ".swf", StringComparison.OrdinalIgnoreCase )) {
				retType = "video";
				retMIME = "application/x-shockwave-flash";
			} else if (-1 < extentionStr.IndexOf( ".flv", StringComparison.OrdinalIgnoreCase )) {
				retType = "video";
				retMIME = "video/x-flv";
			} else if (-1 < extentionStr.IndexOf( ".ivf", StringComparison.OrdinalIgnoreCase )) {
				retType = "video";     //ver10:Indeo Video Technology
			} else if (-1 < extentionStr.IndexOf( ".dvr-ms", StringComparison.OrdinalIgnoreCase )) {
				retType = "video";            //ver12:Microsoft デジタル ビデオ録画
			} else if (-1 < extentionStr.IndexOf( ".m2ts", StringComparison.OrdinalIgnoreCase )) {
				retType = "video";           //ver12:MPEG-2 TS ビデオ ファイル 
			} else if (-1 < extentionStr.IndexOf( ".m1v", StringComparison.OrdinalIgnoreCase )) {
				retType = "video";
			} else if (-1 < extentionStr.IndexOf( ".mp2", StringComparison.OrdinalIgnoreCase )) {
				retType = "video";
			} else if (-1 < extentionStr.IndexOf( ".mpa", StringComparison.OrdinalIgnoreCase )) {
				retType = "video";
			} else if (-1 < extentionStr.IndexOf( ".mpe", StringComparison.OrdinalIgnoreCase )) {
				retType = "video";
			} else if (-1 < extentionStr.IndexOf( ".m3u", StringComparison.OrdinalIgnoreCase )) {
				retType = "video";
			} else if (-1 < extentionStr.IndexOf( ".m4v", StringComparison.OrdinalIgnoreCase )) {
				retType = "video";
			} else if (-1 < extentionStr.IndexOf( ".mp4v", StringComparison.OrdinalIgnoreCase )) {
				retType = "video";
				//image/////////////////////////////////////////////////////////////////////////
			} else if (-1 < extentionStr.IndexOf( ".jpg", StringComparison.OrdinalIgnoreCase ) ||
					 -1 < extentionStr.IndexOf( ".jpeg", StringComparison.OrdinalIgnoreCase )) {
				retType = "image";
				retMIME = "image/jpeg";
			} else if (-1 < extentionStr.IndexOf( ".gif", StringComparison.OrdinalIgnoreCase )) {
				retType = "image";
				retMIME = "image/gif";
			} else if (-1 < extentionStr.IndexOf( ".png", StringComparison.OrdinalIgnoreCase )) {
				retType = "image";
				retMIME = "image/png";
			} else if (-1 < extentionStr.IndexOf( ".ico", StringComparison.OrdinalIgnoreCase )) {
				retType = "image";
				retMIME = "image/vnd.microsoft.icon";
			} else if (-1 < extentionStr.IndexOf( ".bmp", StringComparison.OrdinalIgnoreCase )) {
				retType = "image";
				retMIME = "image/x-ms-bmp";
				//audio/////////////////////////////////////////////////////////////////////////
			} else if (-1 < extentionStr.IndexOf( ".mp3", StringComparison.OrdinalIgnoreCase )) {
				retType = "audio";
				retMIME = "audio/mpeg";
			} else if (-1 < extentionStr.IndexOf( ".m4a", StringComparison.OrdinalIgnoreCase ) ||
				-1 < extentionStr.IndexOf( ".aac", StringComparison.OrdinalIgnoreCase )
				) {
				retType = "audio";
				retMIME = "audio/aac";         //var12;MP4 オーディオ ファイル
			} else if (-1 < extentionStr.IndexOf( ".ogg", StringComparison.OrdinalIgnoreCase )) {
				retType = "audio";
				retMIME = "audio/ogg";
			} else if (-1 < extentionStr.IndexOf( ".midi", StringComparison.OrdinalIgnoreCase ) ||
				-1 < extentionStr.IndexOf( ".mid", StringComparison.OrdinalIgnoreCase ) ||
				-1 < extentionStr.IndexOf( ".rmi", StringComparison.OrdinalIgnoreCase )
				) {
				retType = "audio";
				retMIME = "audio/midi";          //var9;MIDI 
			} else if (-1 < extentionStr.IndexOf( ".ra", StringComparison.OrdinalIgnoreCase )) {
				retType = "audio";
				retMIME = "audio/vnd.rn-realaudio";
			} else if (-1 < extentionStr.IndexOf( ".flac", StringComparison.OrdinalIgnoreCase )) {
				retType = "audio";
				retMIME = "audio/flac";
			} else if (-1 < extentionStr.IndexOf( ".wma", StringComparison.OrdinalIgnoreCase )) {
				retType = "audio";
				retMIME = "audio/x-ms-wma";
			} else if (-1 < extentionStr.IndexOf( ".wav", StringComparison.OrdinalIgnoreCase )) {
				retType = "audio";
				retMIME = "audio/wav";           //var9;Windows 用オーディオ   
			} else if (-1 < extentionStr.IndexOf( ".aif", StringComparison.OrdinalIgnoreCase ) ||
				-1 < extentionStr.IndexOf( ".aifc", StringComparison.OrdinalIgnoreCase ) ||
				-1 < extentionStr.IndexOf( ".aiff", StringComparison.OrdinalIgnoreCase )
				) {
				retType = "audio";           //var9;Audio Interchange File FormatI 
			} else if (-1 < extentionStr.IndexOf( ".au", StringComparison.OrdinalIgnoreCase )) {
				retType = "audio";          //var9;Sun Microsystems  
			} else if (-1 < extentionStr.IndexOf( ".snd", StringComparison.OrdinalIgnoreCase )) {
				retType = "audio";          //var9; NeXT  
			} else if (-1 < extentionStr.IndexOf( ".cda", StringComparison.OrdinalIgnoreCase )) {
				retType = "audio";          //var9;CD オーディオ トラック 
			} else if (-1 < extentionStr.IndexOf( ".adt", StringComparison.OrdinalIgnoreCase )) {
				retType = "audio";          //var12;Windows オーディオ ファイル 
			} else if (-1 < extentionStr.IndexOf( ".adts", StringComparison.OrdinalIgnoreCase )) {
				retType = "audio";           //var12;Windows オーディオ ファイル 
			} else if (-1 < extentionStr.IndexOf( ".asx", StringComparison.OrdinalIgnoreCase )) {
				retType = "audio";
				//text/////////////////////////////////////////////////////////////////////////
			} else if (-1 < extentionStr.IndexOf( ".txt", StringComparison.OrdinalIgnoreCase )) {
				retType = "text";
				retMIME = "text/plain";
			} else if (-1 < extentionStr.IndexOf( ".html", StringComparison.OrdinalIgnoreCase ) ||
				-1 < extentionStr.IndexOf( ".htm", StringComparison.OrdinalIgnoreCase )
				) {
				retType = "text";
				retMIME = "text/html";
			} else if (-1 < extentionStr.IndexOf( ".xhtml", StringComparison.OrdinalIgnoreCase )) {
				retMIME = "application/xhtml+xml";
			} else if (-1 < extentionStr.IndexOf( ".xml", StringComparison.OrdinalIgnoreCase )) {
				retType = "text";
				retMIME = "text/xml";
			} else if (-1 < extentionStr.IndexOf( ".rss", StringComparison.OrdinalIgnoreCase )) {
				retType = "text";
				retMIME = "application/rss+xml";
			} else if (-1 < extentionStr.IndexOf( ".xml", StringComparison.OrdinalIgnoreCase )) {
				retType = "text";
				retMIME = "application/xml";            //、text/xml
			} else if (-1 < extentionStr.IndexOf( ".css", StringComparison.OrdinalIgnoreCase )) {
				retType = "text";
				retMIME = "text/css";
			} else if (-1 < extentionStr.IndexOf( ".js", StringComparison.OrdinalIgnoreCase )) {
				retType = "text";
				retMIME = "text/javascript";
			} else if (-1 < extentionStr.IndexOf( ".vbs", StringComparison.OrdinalIgnoreCase )) {
				retType = "text";
				retMIME = "text/vbscript";
			} else if (-1 < extentionStr.IndexOf( ".cgi", StringComparison.OrdinalIgnoreCase )) {
				retType = "text";
				retMIME = "application/x-httpd-cgi";
			} else if (-1 < extentionStr.IndexOf( ".php", StringComparison.OrdinalIgnoreCase )) {
				retType = "text";
				retMIME = "application/x-httpd-php";
				//application/////////////////////////////////////////////////////////////////////////
			} else if (-1 < extentionStr.IndexOf( ".zip", StringComparison.OrdinalIgnoreCase )) {
				retType = "application";
				retMIME = "application/zip";
			} else if (-1 < extentionStr.IndexOf( ".pdf", StringComparison.OrdinalIgnoreCase )) {
				retType = "application";
				retMIME = "application/pdf";
			} else if (-1 < extentionStr.IndexOf( ".doc", StringComparison.OrdinalIgnoreCase )) {
				retType = "application";
				retMIME = "application/msword";
			} else if (-1 < extentionStr.IndexOf( ".xls", StringComparison.OrdinalIgnoreCase )) {
				retType = "application";
				retMIME = "application/msexcel";
			} else if (-1 < extentionStr.IndexOf( ".wmx", StringComparison.OrdinalIgnoreCase )) {
				retType = "application";        //ver9:Windows Media Player スキン 
			} else if (-1 < extentionStr.IndexOf( ".wms", StringComparison.OrdinalIgnoreCase )) {
				retType = "application";       //ver9:Windows Media Player スキン  
			} else if (-1 < extentionStr.IndexOf( ".wmz", StringComparison.OrdinalIgnoreCase )) {
				retType = "application";       //ver9:Windows Media Player スキン  
			} else if (-1 < extentionStr.IndexOf( ".wpl", StringComparison.OrdinalIgnoreCase )) {
				retType = "application";       //ver9:Windows Media Player スキン  
			} else if (-1 < extentionStr.IndexOf( ".wmd", StringComparison.OrdinalIgnoreCase )) {
				retType = "application";       //ver9:Windows Media Download パッケージ   

			} else if (-1 < extentionStr.IndexOf( ".wm", StringComparison.OrdinalIgnoreCase )) {        //以降wmで始まる拡張子が誤動作
				retType = "video";
				retMIME = "video/x-ms-wm";
			}
			//	}
			typeName.Text = retType;
			mineType.Text = retMIME;
			return retType;
			//		myLog( dbMsg );
			//		} catch (Exception er) {
			//		Console.WriteLine( TAG + "でエラー発生" + er.Message + ";" + dbMsg );
			//	}
		}       //拡張子からタイプとMIMEを返す

		////web/////////////////////////////////////////////////////////////////ファイル操作///
		private string makeVideoSouce(string fileName, int webWidth, int webHeight)
		{
			string TAG = "[makeVideoSouce]";
			string dbMsg = TAG;
			string contlolPart = "";
			string comentStr = "このタイプの表示は検討中です。";
			string[] extStrs = fileName.Split( '.' );
			string extentionStr = "." + extStrs[extStrs.Length - 1].ToLower();
			string mineTypeStr = mineType.Text;//	"video/x-ms-asf";     //.asf
			string clsId = "";
			string codeBase = "";

			if (extentionStr == ".mp4" ||
				extentionStr == ".webm" ||
				extentionStr == ".ogg"
				) {
				contlolPart += "<div class=" + '"' + "video-container" + '"' + ">\n";
				contlolPart += "\t\t\t<video src=" + '"' + "file://" + fileName + '"' + " controls></video>\n\t\t</div>";          // autoplay
				comentStr = "読み込めないファイルは対策検討中です。。";
			} else if (extentionStr == ".flv" ||
				extentionStr == ".swf"
				) {
				clsId = "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000";
				codeBase = "http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=4,0,0,0";
				contlolPart += "<object classid=" + '"' + clsId + '"' +
								" CODEBASE=" + '"' + codeBase + '"' +
								" width = " + '"' + webWidth + '"' + " height = " + '"' + webHeight + '"' + ">\n";
				//	" id = " + '"' + "previewDB2" + '"' +  " type = " + '"' + mineTypeStr + '"' +">\n";
				//			contlolPart += "\t\t\t<param name=" + '"' + "FlashVars" + '"' + " value=" + '"' + "fms_app=&video_file=" +  "file://" + fileName+'"' + "/>\n";
				//&image_file=&link_url=&autoplay=false&mute=false&vol=&controllbar=true&buffertime=5" />
				contlolPart += "\t\t\t<param name =" + '"' + "movie" + '"' + " value = " + '"' + "file://" + fileName + '"' + "/>\n";
				contlolPart += "\t\t\t<param name =" + '"' + "bgcolor" + '"' + " value = " + '"' + "#FFFFFF" + '"' + "/>\n";
				//		contlolPart += "\t\t\t<param name= " + '"' + "bgcolor" + '"' + " value=" + '"' + "#fff" + '"' + "/>\n";
				contlolPart += "\t\t\t<param name =" + '"' + "LOOP" + '"' + " value = " + '"' + "false" + '"' + "/>\n";
				contlolPart += "\t\t\t<param name =" + '"' + "quality" + '"' + " value = " + '"' + "high" + '"' + "/>\n";
				//		contlolPart += "\t\t\t<param name =E=quality VALUE=high/>\n";
				contlolPart += "\t\t\t\t<embed src=" + '"' + "file://" + fileName + '"' +
											" width=" + webWidth + " height= " + webHeight + " bgcolor=#FFFFFF" +
											" LOOP=false quality=high PLUGINSPAGE=" + '"' + "http://www.macromedia.com/shockwave/download/index.cgi?" +
												"P1_Prod_Version=ShockwaveFlash" + '"' + " type=" + '"' + mineTypeStr + '"' + "/>\n";

				//			contlolPart += "\t\t\t<param name= " + '"' + "allowScriptAccess" + '"' + " value=" + '"' + "always" + '"' + "/>\n";
				//			contlolPart += "\t\t\t<param name= " + '"' + "allowFullScreen" + '"' + " value=" + '"' + "true" + '"' + "/>\n";
				//			contlolPart += "\t\t\t<param name= " + '"' + "scale" + '"' + " value=" + '"' + "noscale" + '"' + "/>\n";
				//	contlolPart += "\t\t\t<param name=" + '"' + "FlashVars" + '"' + " value=" + '"' +  '"' + "/>\n";
				//			contlolPart += "\n\t\t\t<param name=" + '"' + "FlashVars" + '"' + " value=" + '"' + "file://" + fileName + '"' + "/>\n";
				/* 
				 * < EMBED SRC="test.swf" WIDTH=300 HEIGHT=300 bgcolor=#FFFFFF LOOP=false QUALITY=high 
PLUGINSPAGE="http://www.macromedia.com/shockwave/download/index.cgi?P1_Prod_Version=ShockwaveFlash" TYPE="application/x-shockwave-flash" </EMBED>


				 * <param name="flashvars" value="fms_app=&amp;video_file=MVI_7565.flv&amp;image_file=&amp;link_url=&amp;autoplay=false&amp;mute=false&amp;vol=&amp;controllbar=true&amp;buffertime=5">
				contlolPart += "\t\t\t<embed type=" + '"' + mineTypeStr + '"' + " align = " + '"' + "middle" + '"' +
															" width = " + '"' + webWidth + '"' + " height = " + '"' + webHeight + '"' +
															" name = " + '"' + "previewDB2" + '"' + " allowScriptAccess = " + '"' + "always" + '"' +
															" allowFullScreen = " + '"' + "true" + '"' + " scale = " + '"' + "noscale" + '"' +
															" quality = " + '"' + "high" + '"' + " src = " + '"' + "file://" + fileName + '"' +
															" bgcolor = " + '"' + "#fff" + '"' + " FlashVars = " + '"'  + '"' + "/></embed>\n";
			*/


				//		contlolPart += "\n\t\t< param name = " + '"' + "FlashVars" + '"' + "value = " + '"' + "flv= + '"' +fileName + '"' +"&autoplay=1&margin=0" + '"' + "/>\n\t\t\t";
			} else if (extentionStr == ".wmv" ||        //ver9:Windows Media 形式
				extentionStr == ".asf" ||
				extentionStr == ".wm" ||
				extentionStr == ".asx" ||        //ver9:Windows Media メタファイル 
				extentionStr == ".wax" ||        //ver9:Windows Media メタファイル 
				extentionStr == ".wvx" ||        //ver9:Windows Media メタファイル 
				extentionStr == ".wmx" ||        //ver9:Windows Media メタファイル 
				extentionStr == ".ivf" ||        //ver10:Indeo Video Technology
				extentionStr == ".dvr-ms" ||        //ver12:Microsoft デジタル ビデオ録画
				extentionStr == ".m2ts" ||        //ver12:MPEG-2 TS ビデオ ファイル 
				extentionStr == ".mpg" ||
				extentionStr == ".m1v" ||
				extentionStr == ".mp2" ||
				extentionStr == ".mpa" ||
				extentionStr == ".mpe" ||
				extentionStr == ".m3u" ||
				extentionStr == ".mp4" ||        //ver12:MP4 ビデオ ファイル 
				extentionStr == ".m4v" ||
				extentionStr == ".mp4v" ||
				extentionStr == ".mpeg" ||
				extentionStr == ".mpeg" ||
				extentionStr == ".mpeg" ||
				extentionStr == ".3gp" ||
				extentionStr == ".3gpp" ||
				extentionStr == ".qt" ||
				extentionStr == ".mov"       //ver12:QuickTime ムービー ファイル 
				) {
				clsId = "CLSID:6BF52A52-394A-11d3-B153-00C04F79FAA6";   //Windows Media Player9
				contlolPart += "\n\t\t<object classid =" + '"' + clsId + '"' + " width = " + '"' + webWidth + '"' + " height = " + '"' + webHeight + '"' + ">\n";
				contlolPart += "\t\t\t<param name =" + '"' + "url" + '"' + "value = " + '"' + "file://" + fileName + '"' + "/>\n";
				contlolPart += "\t\t\t<param name =" + '"' + "stretchToFit" + '"' + " value = true />\n";//右クリックして縮小/拡大で200％
				contlolPart += "\t\t\t<param name =" + '"' + "autoStart" + '"' + " value = " + true + "/>\n";
				comentStr = "Windows Media Player9読み込めないファイルは対策検討中です。";
				///参照 http://so-zou.jp/web-app/tech/html/sample/embed-video.htm/////
			} else {
				comentStr = "この形式は対応確認中です。";
			}
			contlolPart += "\t\t</object>\n";

			contlolPart += "\t\t<div>\n\t\t\t" + comentStr + "\n\t\t</div>\n";
			myLog( dbMsg );
			return contlolPart;
		}           //Video用のタグを作成

		private string makeImageSouce(string fileName, int webWidth, int webHeight)
		{
			string TAG = "[makeImageSouce]";
			string dbMsg = TAG;
			string contlolPart = "";
			string comentStr = "";
			string[] extStrs = fileName.Split( '.' );
			string extentionStr = "." + extStrs[extStrs.Length - 1].ToLower();
			if (extentionStr == ".jpg" ||
				extentionStr == ".jpeg" ||
				extentionStr == ".png" ||
				extentionStr == ".gif"
				) {
			} else {
				/*	 ".tif", ".ico", ".bmp" };*/
				comentStr = "静止画はimgタグで読めるもののみ対応しています。";
			}
			contlolPart += "\n\t\t<img src = " + '"' + fileName + '"' + " style=" + '"' + "width:100%" + '"' + "/>\n";
			// + '"' + webWidth + '"' + " height = " + '"' + webHeight + '"' +
			contlolPart += "\t\t<div>\n\t\t\t" + comentStr + "\n\t\t</div>\n";
			myLog( dbMsg );
			return contlolPart;
		}  //静止画用のタグを作成


		private string makeAudioSouce(string fileName)
		{
			string TAG = "[makeAudioSouce]";
			string dbMsg = TAG;
			string contlolPart = "";
			string comentStr = "";
			string[] extStrs = fileName.Split( '.' );
			string extentionStr = "." + extStrs[extStrs.Length - 1].ToLower();

			if (extentionStr == ".mp3" ||
				extentionStr == ".aac" ||
				extentionStr == ".m4a" ||           //iTurne
				extentionStr == ".ogg"
				) {
				//		contlolPart += "<div class=" + '"' + "video-container" + '"' + ">\n";
				contlolPart += "\t\t\t<audio src=" + '"' + "file://" + fileName + '"' + " controls autoplay style = " + '"' + "width:100%" + '"' + " />\n";
				comentStr = "audioタグで読み込めないファイルは対策検討中です。。";
			} else if (extentionStr == ".wma" ||
				extentionStr == ".wvx" ||
				extentionStr == ".wax" ||
				extentionStr == ".wav" ||
				extentionStr == ".m4a" ||           //var12;MP4 オーディオ ファイル
				extentionStr == ".midi" ||           //var9;MIDI 
				extentionStr == ".mid" ||           //var9;MIDI 
				extentionStr == ".rmi" ||           //var9;MIDI 
				extentionStr == ".aif" ||           //var9;Audio Interchange File FormatI 
				extentionStr == ".aifc" ||           //var9;Audio Interchange File FormatI 
				extentionStr == ".aiff" ||           //var9;Audio Interchange File FormatI 
				extentionStr == ".au" ||           //var9;Sun Microsystems および NeXT  
				extentionStr == ".snd" ||           //var9;Sun Microsystems および NeXT  
				extentionStr == ".wav" ||           //var9;Windows 用オーディオ   
				extentionStr == ".cda" ||           //var9;CD オーディオ トラック 
				extentionStr == ".adt" ||           //var12;Windows オーディオ ファイル 
				extentionStr == ".adts" ||           //var12;Windows オーディオ ファイル 
				extentionStr == ".asx"
				) {
				string clsId = "CLSID:6BF52A52-394A-11d3-B153-00C04F79FAA6";   //Windows Media Player9
				contlolPart += "\n\t\t<object classid =" + '"' + clsId + '"' + " style = " + '"' + "width:100%" + '"' + " >\n";
				contlolPart += "\t\t\t<param name =" + '"' + "url" + '"' + "value = " + '"' + "file://" + fileName + '"' + "/>\n";
				contlolPart += "\t\t\t<param name =" + '"' + "stretchToFit" + '"' + " value = true />\n";//右クリックして縮小/拡大で200％
				contlolPart += "\t\t\t<param name =" + '"' + "autoStart" + '"' + " value = " + true + "/>\n";
				comentStr = "Windows Media Player9読み込めないファイルは対策検討中です。";

				/*		contlolPart += "<ASX VERSION =" + '"' + "3.0"  + '"' + " >\n";
						contlolPart += "\t\t<ENTRY >\n";
						contlolPart += "\t\t\t<REF HREF =" + '"' +  fileName + '"' + " >\n";//"file://" +
						contlolPart += "\t\t\t</ENTRY >\n";
						contlolPart += "\t\t\t</ASX >\n";
						  comentStr = "ASXタグで確認中です。(Windows Media Player　がサポートしている形式)";*/
			} else {
				/* ".ra", ".flac",  }; */
				comentStr = "このファイルの再生方法は確認中です。";
			}
			contlolPart += "\t\t<div>\n\t\t\t" + comentStr + "\n\t\t</div>\n";
			myLog( dbMsg );
			return contlolPart;
		}  //静止画用のタグを作成


		private string makeTextSouce(string fileName, int webWidth, int webHeight)
		{
			string TAG = "[makeTextSouce]";
			string dbMsg = TAG;
			string contlolPart = "";
			string comentStr = "";
			string[] extStrs = fileName.Split( '.' );
			string extentionStr = "." + extStrs[extStrs.Length - 1].ToLower();
			if (extentionStr == ".txt") {
				contlolPart += "<object type=" +'"' + "text/html" + "  data="+ "file://" + fileName + '"' + 
									" style = " + '"' + "width:100%" + '"' + '"'  + " >\n";
				contlolPart += "\t\t</object>\n";

				/*
				 <div>
<object type="text/html" data="外部ファイルのURL" height="100px" width="100px">
この部分は object 対応のブラウザで見てください。
</object>
</div>
			 */

			} else {
				// ".xhtml", ".xml", ".rss", ".xml", ".css", ".js", ".vbs", ".cgi", ".php" };

				comentStr = "このファイルの表示方法は確認中です。";
			}
			contlolPart += "\t\t<div>\n\t\t\t" + comentStr + "\n\t\t</div>\n";
			myLog( dbMsg );
			return contlolPart;
		}  //アプリケーション用のタグを作成


		private string makeApplicationeSouce(string fileName, int webWidth, int webHeight)
		{
			string TAG = "[makeApplicationeSouce]";
			string dbMsg = TAG;
			string contlolPart = "";
			string comentStr = "";
			string[] extStrs = fileName.Split( '.' );
			string extentionStr = "." + extStrs[extStrs.Length - 1].ToLower();
			if (extentionStr == ".wmx" ||        //ver9:Windows Media Player スキン 
				extentionStr == ".wms" ||        //ver9:Windows Media Player スキン  
				extentionStr == ".wmz" ||     //ver9:Windows Media Player スキン  
				extentionStr == ".wms" ||     //ver9:Windows Media Player スキン  
				extentionStr == ".wmd"     //ver9:Windows Media Download パッケージ   
				) {
				string clsId = "CLSID:6BF52A52-394A-11d3-B153-00C04F79FAA6";   //Windows Media Player9
				contlolPart += "\n\t\t<object classid =" + '"' + clsId + '"' + " style = " + '"' + "width:100%" + '"' + " >\n";
				contlolPart += "\t\t\t<param name =" + '"' + "url" + '"' + "value = " + '"' + "file://" + fileName + '"' + "/>\n";
				contlolPart += "\t\t\t<param name =" + '"' + "stretchToFit" + '"' + " value = true />\n";//右クリックして縮小/拡大で200％
				contlolPart += "\t\t\t<param name =" + '"' + "autoStart" + '"' + " value = " + true + "/>\n";
				comentStr = "Windows Media Player9読み込めないファイルは対策検討中です。";
			} else {
				comentStr = "このファイルの再生方法は確認中です。";
			}
			contlolPart += "\t\t<div>\n\t\t\t" + comentStr + "\n\t\t</div>\n";
			myLog( dbMsg );
			return contlolPart;
		}  //アプリケーション用のタグを作成


		private void makeWebSouce(string fileName)
		{
			string TAG = "[makeWebSouce]";
			string dbMsg = TAG;
			try {
				dbMsg += ",fileName=" + fileName;
				string urlStr = System.Reflection.Assembly.GetExecutingAssembly().Location;//res://
				urlStr = urlStr.Substring( 0, urlStr.IndexOf( "bin" ) ) + "brows.htm";
				dbMsg += ",url=" + urlStr;
				int webWidth = webBrowser1.Width - 20;
				int webHeight = webBrowser1.Height - 40;
				dbMsg += ",web[" + webWidth + "×" + webHeight + "]";
				string[] extStrs = fileName.Split( '.' );
				string extentionStr = "." + extStrs[extStrs.Length - 1].ToLower();
				if (extentionStr == ".htm" ||
					extentionStr == ".html") {
					urlStr = fileName;
				} else {
					string contlolPart = @"<!DOCTYPE html>
	<html>
		<head>
			<meta charset = " + '"' + "UTF-8" + '"' + " >";
					contlolPart += "\n\t\t\t<meta http-equiv = " + '"' + "X-UA-Compatible" + '"' + " content =  " + '"' + "requiresActiveX =true" + '"' + " />";
					contlolPart += "\n\t\t\t<link rel = " + '"' + "stylesheet" + '"' + " type = " + '"' + "text/css" + '"' + " href = " + '"' + "brows.css" + '"' + "/>\n";
					contlolPart += "\t</head>\n\t<body>\n\t\t";
					string retType = GetFileTypeStr( fileName );
					dbMsg += ",retType=" + retType;
					if (retType == "video") {
						contlolPart += makeVideoSouce( fileName, webWidth, webHeight );
					} else if (retType == "image") {
						contlolPart += makeImageSouce( fileName, webWidth, webHeight );
					} else if (retType == "audio") {
						contlolPart += makeAudioSouce( fileName );
					} else if (retType == "text") {
						contlolPart += makeTextSouce( fileName, webWidth, webHeight );
					} else if (retType == "application") {
						contlolPart += makeApplicationeSouce( fileName, webWidth, webHeight );
					}
					contlolPart += @"	</body>
</html>

";
					dbMsg += ",contlolPart=" + contlolPart;
					if (File.Exists( urlStr )) {
						dbMsg += "既存ファイル有り";
						System.IO.File.Delete( urlStr );                //20170818;ここで停止？
						dbMsg += ">Exists=" + File.Exists( urlStr );
					}
					////UTF-8でテキストファイルを作成する
					System.IO.StreamWriter sw = new System.IO.StreamWriter( urlStr, false, System.Text.Encoding.UTF8 );
					sw.Write( contlolPart );
					sw.Close();
					dbMsg += ">Exists=" + File.Exists( urlStr );
				}
				Uri nextUri = new Uri( "file://" + urlStr );
				dbMsg += ",nextUri=" + nextUri;
				webBrowser1.Navigate( nextUri );
				myLog( dbMsg );
			} catch (Exception er) {
				Console.WriteLine( TAG + "でエラー発生" + er.Message + ";" + dbMsg );
			}
		}//形式に合わせたhtml作成
		 /*		http://html5-css3.jp/tips/youtube-html5video-window.html
		  *		http://dobon.net/vb/dotnet/string/getencodingobject.html
		  */

		/*		private async Task WriteTextAsync(string filePath, string text)
				{
					byte[] encodedText = Encoding.Unicode.GetBytes( text );

					using (FileStream sourceStream = new FileStream( filePath,
						FileMode.Append, FileAccess.Write, FileShare.None,
						bufferSize: 4096, useAsync: true )) {
						await sourceStream.WriteAsync( encodedText, 0, encodedText.Length );
					};
				}*/

		protected override void OnPaint(PaintEventArgs e)
		{
			string TAG = "[OnPaint]";
			string dbMsg = TAG;
			base.OnPaint( e );
			makeWebSouce( passNameLabel.Text + Path.DirectorySeparatorChar + fileNameLabel.Text );
			myLog( dbMsg );
		}           //リサイズ時の再描画

		private void ReSizeViews(object sender, EventArgs e)
		{
			string TAG = "[ReSizeViews]";
			string dbMsg = TAG;
			try {
				//		Size size = Form1.ScrollRectangle.Size; //webBrowser1.Document.Bodyだとerror! Body is null;
				//	var leftPWidth = 405;
				dbMsg += "[" + this.Width + "×" + this.Height + "]";
				dbMsg += ",leftTop=" + splitContainerLeftTop.Height + ",Center=" + splitContainerCenter.Height;
				//		splitContainer1.Panel1.Width = leftPWidth;
				//	splitContainerLeftTop.Height = 60;
				//	splitContainerCenter.Panel1.Height = this.Height-(60+80);            //_Panel2.
				//	splitContainerCenter.Panel2.Height = 80;            //_Panel2.
				//		splitContainerCenter.Width = leftPWidth;
				dbMsg += ">>2=" + splitContainerLeftTop.Height + ">>Center=" + splitContainerCenter.Height;
				makeWebSouce( fileNameLabel.Text );
				myLog( dbMsg );
			} catch (Exception er) {
				Console.WriteLine( TAG + "でエラー発生" + er.Message + ";" + dbMsg );
			}
		}//形式に合わせたhtml作成

		////時計表示////////////////////////////////////////////////////////////////////
		private void timer1_Tick(object sender, EventArgs e)
		{
			SetDisplayTime();
		}

		private void SetDisplayTime()
		{
			timeNow.Text = DateTime.Now.ToString( "HH時mm分 ss秒" );
		}
		//デバッグツール///////////////////////////////////////////////////////////その他//
		Boolean debug_now = true;
		private void myLog(string msg)
		{
			if (debug_now) {
				Console.WriteLine( msg );
			}
		}
	}
}
