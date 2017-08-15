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

namespace WindowsFormsApp1
{
	public partial class Form1 : Form
	{
		DirectoryInfo di;

		public Form1()
		{
			InitializeComponent();
		}

		private void Form1_Load(object sender, EventArgs e)
		{
			makeDriveList();
		}

		private void treeView1_BeforeExpand(object sender, TreeViewCancelEventArgs e)
		{
			TreeNode tn = e.Node, tn2;
			string d = tn.FullPath;//展開するノードのフルパスを取得
			tn.Nodes.Clear();
			di = new DirectoryInfo( d );//ディレクトリ一覧を取得
			try {
				foreach (DirectoryInfo d2 in di.GetDirectories()) { 
					tn2 = new TreeNode( d2.Name, 1, 2 );
					tn.Nodes.Add( tn2 );
					folderItemListUp( d2.Name,tn2 );
				//	tn2.Nodes.Add( "..." );
				}
				foreach (FileInfo fi in di.GetFiles()) {
					tn2 = new TreeNode( fi.Name, 3, 3 );
					tn.Nodes.Add( tn2 );
				}
			} catch { }
		}       //ノードを展開しようとしているときに発生するイベント

		private void treeView1_AfterSelect(object sender, TreeViewEventArgs e)//NodeMouseClickが利かなかった
		{
			string selectItem = e.Node.Text;// = listBox1.SelectedItem.ToString();

		//	string selectItem = listBox1.SelectedItem.ToString();
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
				TreeNode tNode = new TreeNode( selectItem,3,3 );
				folderItemListUp( selectItem, tNode );
			}
			infoStr += ",絶対パス;";
			infoStr += fi.FullName;//       
		//	infoStr += ",ファイル名;";
		//	infoStr += fi.Name;//ファイル名
			infoStr += ",親ディレクトリ;";
			infoStr += fi.Directory;//     
	//		infoStr += ",親ディレクトリ名;";
		//	infoStr += fi.DirectoryName;//親ディレクトリ名
			fileinfo.Text = infoStr;
			string fullPathName = fi.DirectoryName;//親ディレクトリ名= e.Node.FullPath;
			textBox1.Text = fi.DirectoryName;    //I:\\ハイキュー 25 Haikyuu 25 (HD).mp4
			textBox2.Text = fi.Name;//ファイル名= selectItem;


		}

		private void folderItemListUp(string sarchDir, TreeNode tNode)//, string sarchTyp
		{
			try {
		//		Console.WriteLine( sarchDir );
				string[] files = Directory.GetFiles( sarchDir );
				if (files != null) {
					foreach (string fileName in files) {
						if (0 < fileName.IndexOf( "RECYCLE.BIN", StringComparison.OrdinalIgnoreCase )) {
						} else {
							string rfileName = fileName.Replace( sarchDir, "" );
							tNode.Nodes.Add( rfileName );

					//		listBox1.Items.Add( rfileName );      //ListBox1に結果を表示する
						}
					}
				}
				string[] foleres = Directory.GetDirectories( sarchDir );//
				if (foleres != null) {
					foreach (string folereName in foleres) {
						if (0 < folereName.IndexOf( "RECYCLE", StringComparison.OrdinalIgnoreCase ) ||
							0 < folereName.IndexOf( "System Vol", StringComparison.OrdinalIgnoreCase )) {
						} else {
							tNode.Nodes.Add( folereName );

					//		listBox1.Items.Add( folereName );
							//        makeFolderList(folereName);
						}
					}           //ListBox1に結果を表示する

				}
			} catch (UnauthorizedAccessException UAEx) {
				Console.WriteLine( UAEx.Message );
			} catch (PathTooLongException PathEx) {
				Console.WriteLine( PathEx.Message );
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
		}			//リストアイテムのクリック

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
			TreeNode tn;
			foreach (DriveInfo drive in DriveInfo.GetDrives())//http://www.atmarkit.co.jp/fdotnet/dotnettips/557driveinfo/driveinfo.html
			{
				string driveNames = drive.Name; // ドライブ名
				if (drive.IsReady) { // ドライブの準備はOK？
					comboBox1.Items.Add( driveNames ); //comboBoxに結果を表示する
													   //         Console.WriteLine("\t{0}\t{1}\t{2}",
													   //           drive.DriveFormat,  // フォーマット
													   //           drive.DriveType,    // 種類
													   //           drive.VolumeLabel); // ボリュームラベル
						tn = new TreeNode( driveNames, 0, 0 );//ノードにドライブアイコンを設定
						treeView1.Nodes.Add( tn );//親ノードにドライブを設定
						folderItemListUp( driveNames, tn );
				}
				//       else
				//      {
				//          Console.WriteLine("\tNot Ready");
				//      }
			}
			//    string selectDrive = @"C:\";
			comboBox1.SelectedIndex = 3;

		}//使用可能なドライブリスト取得

		////時計表示////////////////////////////////////////////////////////////////////
		private void timer1_Tick(object sender, EventArgs e)
		{
			SetDisplayTime();
		}

		private void SetDisplayTime()
		{
			timeNow.Text = DateTime.Now.ToString( "HH時mm分 ss秒" );
		}
	}
}
