using System;
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
		//	DirectoryInfo di;

		public Form1()
		{
			InitializeComponent();
		}

		private void Form1_Load(object sender, EventArgs e)
		{
			fileTree.ImageList = this.imageList1;   //☆treeView1では設定できなかった
			makeDriveList();
		}

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

		private void treeView1_AfterSelect(object sender, TreeViewEventArgs e)//NodeMouseClickが利かなかった
		{
			string TAG = "[treeView1_AfterSelect]";
			string dbMsg = TAG;
			try {
				//		dbMsg += "sender=" + sender;                    //sender=	常にSystem.Windows.Forms.TreeView, Nodes.Count: 5, Nodes[0]: TreeNode: C:\,
				//		dbMsg += ",e=" + e;                             //e=		常にSystem.Windows.Forms.TreeViewEventArgs,
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
				//リストビュー全体で利用するアイコンの設定
				//		fileTree.ImageIndex = 0;
				//		fileTree.SelectedImageIndex = 2;

				string[] files = Directory.GetFiles( sarchDir );        //		sarchDir	"C:\\\\マイナンバー.pdf"	string	☆sarchDir = "\\2013.m3u"でフルパスになっていない
				if (files != null) {
					foreach (string fileName in files) {
						if (0 < fileName.IndexOf( "RECYCLE.BIN", StringComparison.OrdinalIgnoreCase )) {
						} else {
							string rfileName = fileName.Replace( sarchDir, "" );
							rfileName = rfileName.Replace( Path.DirectorySeparatorChar + "", "" );
							dbMsg += ",file=" + rfileName;
							string retType = GetFileTypeStr( fileName );
							dbMsg += ",retType=" + retType;
							int iconType = 2;
							if (retType == "move") {
								iconType = 3;
							} else if (retType == "pict") {
								iconType = 4;
							} else if (retType == "music") {
								iconType = 5;
							}
							dbMsg += ",iconType=" + iconType;
							tNode.Nodes.Add( fileName, rfileName, iconType, iconType );
						}
					}
				}
				string[] foleres = Directory.GetDirectories( sarchDir );//
				if (foleres != null) {
					foreach (string folereName in foleres) {
						if (0 < folereName.IndexOf( "RECYCLE", StringComparison.OrdinalIgnoreCase ) ||
							0 < folereName.IndexOf( "System Vol", StringComparison.OrdinalIgnoreCase )) {
						} else {
							string rfolereName = folereName.Replace( sarchDir, "" );// + 
							rfolereName = rfolereName.Replace( Path.DirectorySeparatorChar + "", "" );
							dbMsg += ",foler=" + rfolereName;
							tNode.Nodes.Add( folereName, rfolereName, 1, 1 );
							/*		if (0<tNode.Nodes.Count) {
										tNode.ForeColor = Color.Wheat;
										tNode.BackColor = Color.DarkGray;
									}*/
							//		tNode.SelectedImageIndex =1;
							//		tNode.ImageIndex = 1;       //folder_close_icon.png
						}
					}           //ListBox1に結果を表示する

				}
				myLog( dbMsg );
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
						if (0 < fileName.IndexOf( "RECYCLE.BIN", StringComparison.OrdinalIgnoreCase )) {
						} else {

							string rfileName = fileName.Replace( sarchDir, "" );
							listBox1.Items.Add( rfileName );      //ListBox1に結果を表示する
						}
					}
				}
				string[] foleres = Directory.GetDirectories( sarchDir );//
				if (foleres != null) {
					foreach (string folereName in foleres) {
						if (0 < folereName.IndexOf( "RECYCLE", StringComparison.OrdinalIgnoreCase ) ||
							0 < folereName.IndexOf( "System Vol", StringComparison.OrdinalIgnoreCase )
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

		private void makeDriveList()
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
			string TAG = "[getFileType]";
			string dbMsg = TAG;
			//	try {
			string retType = "";
			if (0 < checkFileName.IndexOf( ".mov", StringComparison.OrdinalIgnoreCase ) ||
				0 < checkFileName.IndexOf( ".mp4", StringComparison.OrdinalIgnoreCase ) ||
				0 < checkFileName.IndexOf( ".3gp", StringComparison.OrdinalIgnoreCase ) ||
				0 < checkFileName.IndexOf( ".wmv", StringComparison.OrdinalIgnoreCase ) ||
				0 < checkFileName.IndexOf( ".flv", StringComparison.OrdinalIgnoreCase )
				) {
				retType = "move";
			} else if (0 < checkFileName.IndexOf( ".jpg", StringComparison.OrdinalIgnoreCase ) ||
			   0 < checkFileName.IndexOf( ".gif", StringComparison.OrdinalIgnoreCase ) ||
			   0 < checkFileName.IndexOf( ".png", StringComparison.OrdinalIgnoreCase ) ||
			   0 < checkFileName.IndexOf( ".tif", StringComparison.OrdinalIgnoreCase ) ||
			   0 < checkFileName.IndexOf( ".bmp", StringComparison.OrdinalIgnoreCase )
			) {
				retType = "pict";
			} else if (0 < checkFileName.IndexOf( ".mp3", StringComparison.OrdinalIgnoreCase ) ||
				0 < checkFileName.IndexOf( ".m4a", StringComparison.OrdinalIgnoreCase ) ||
				0 < checkFileName.IndexOf( ".aac", StringComparison.OrdinalIgnoreCase ) ||
				0 < checkFileName.IndexOf( ".wma", StringComparison.OrdinalIgnoreCase ) ||
				0 < checkFileName.IndexOf( ".wav", StringComparison.OrdinalIgnoreCase )
			) {
				retType = "music";
			}
			return retType;
			//		myLog( dbMsg );
			//		} catch (Exception er) {
			//		Console.WriteLine( TAG + "でエラー発生" + er.Message + ";" + dbMsg );
			//	}
		}       //フォルダの中身をリストアップ
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
