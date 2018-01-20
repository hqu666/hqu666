using Android.App;
using Android.Widget;
using Android.OS;
using Android.Content;

using Android;
//import android.Manifest;
//import android.accounts.AccountManager;
//import android.annotation.SuppressLint;
using Android.App;
using Android.Content;
using Android.Content.PM;
//import android.content.Context;
//import android.content.DialogInterface;
//import android.content.Intent;
//import android.content.IntentFilter;
//import android.content.SharedPreferences;
//import android.content.pm.PackageManager;
//import android.content.res.Configuration;using Android.OS;
//import android.app.Activity;
//import android.app.ActivityManager;
//import android.app.AlertDialog;
//import android.app.Fragment;
//import android.app.FragmentManager;
//import android.app.FragmentTransaction;
//import android.app.Notification;
//import android.app.NotificationChannel;
//import android.app.NotificationManager;
//import android.app.PendingIntent;
//import android.app.TaskStackBuilder;

//import android.graphics.Color;
//import android.graphics.drawable.Icon;
//import android.location.Criteria;
//import android.location.Location;
//import android.location.LocationListener;
//import android.location.LocationManager;
//import android.location.LocationProvider;
//import android.net.Uri;
//import android.net.wifi.ScanResult;
//import android.net.wifi.WifiInfo;
//import android.net.wifi.WifiManager;
using Android.OS;
//import android.os.Build;
//import android.os.Bundle;
//import android.os.Environment;
//import android.os.Message;
using Android.Runtime;
//import android.preference.PreferenceManager;
//import android.provider.Settings;
//import android.support.annotation.NonNull;
//import android.support.annotation.Nullable;
//import android.support.design.widget.FloatingActionButton;
//import android.support.design.widget.NavigationView;
//using Android.Support.V4.App;
//import android.support.v4.app.ActivityCompat;
//import android.support.v4.app.NotificationCompat;
using Android.Support.V4.Content;
//import android.support.v4.content.ContextCompat;
//import android.support.v4.view.GravityCompat;
//import android.support.v4.widget.DrawerLayout;
//import android.support.v7.app.ActionBarDrawerToggle;
//import android.support.v7.app.AppCompatActivity;
//import android.support.v7.widget.Toolbar;
//import android.util.Log;
using Android.Views;
//import android.view.KeyEvent;
//import android.view.LayoutInflater;
//import android.view.Menu;
//import android.view.MenuItem;
//import android.view.View;
//import android.view.ViewGroup;
using Android.Widget;
using System.Linq;
using Plugin.Permissions;
using Android.Preferences;
using System;
//import android.widget.AdapterView;
//import android.widget.ArrayAdapter;
//import android.widget.EditText;
//import android.widget.ImageView;
//import android.widget.ListView;
//import android.widget.TextView;
//import android.widget.Toast;

//import com.google.android.gms.auth.api.Auth;
//import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
//import com.google.android.gms.auth.api.signin.GoogleSignInResult;
//import com.google.android.gms.common.ConnectionResult;
//import com.google.android.gms.common.api.GoogleApiClient;
//import com.google.api.client.extensions.android.http.AndroidHttp;
//import com.google.api.client.googleapis.extensions.android.gms.auth.GoogleAccountCredential;
//import com.google.api.client.googleapis.extensions.android.gms.auth.UserRecoverableAuthIOException;
//import com.google.api.client.http.ByteArrayContent;
//import com.google.api.client.http.GenericUrl;
//import com.google.api.client.http.HttpResponse;
//import com.google.api.client.json.gson.GsonFactory;
//import com.google.api.services.drive.DriveScopes;
////import com.google.api.services.drive.model.File;
//import com.google.api.services.drive.model.File;
//import com.google.api.services.drive.model.FileList;

//import static android.os.SystemClock.elapsedRealtime;

//import com.google.api.client.googleapis.extensions.android.gms.auth.GoogleAuthIOException;
//import com.google.api.client.json.gson.GsonFactory;
//import com.google.api.services.drive.Drive;
//import com.google.api.services.drive.Drive.Files;
//import com.google.firebase.auth.GoogleAuthProvider;

//import android.os.Handler;

//import java.io.BufferedReader;
////import java.io.File;
//import java.io.FileOutputStream;
//import java.io.IOException;
//import java.io.InputStream;
//import java.io.InputStreamReader;
//import java.nio.charset.Charset;
//import java.text.DateFormat;
//import java.text.SimpleDateFormat;
//import java.util.ArrayList;
//import java.util.Arrays;
//import java.util.Date;
//import java.util.List;
//import java.util.Map;
namespace APlogerNU {
	[Activity(Label = "APlogerNU", MainLauncher = true)]
	public class MainActivity : Activity {
		public Context context;
		public Toolbar MyToolbar;                        //このアクティビティのtoolBar
														 /*
															 public DrawerLayout drawer;
														   public ActionBarDrawerToggle abdToggle;        //アニメーションインジケータ
														   public NavigationView navigationView;

														   public java.io.File wrDir;//自分のアプリ用の内部ディレクトリ
														   public String wrDirName;
														   public final DateFormat df = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
														   public final DateFormat dfs = new SimpleDateFormat("MM/dd HH:mm:ss");
														   public final DateFormat dffn = new SimpleDateFormat("yyyyMMddHHmmss");
														   public Date date;
														   public Boolean isServiceRunning = false;            //サービス実行中

														   public int fragmentNo = -1;
														   public MainFragment mainFragment = null;                            //メイン画面
														   //	public FloatingActionButton fab;
														   public int mainFragmentNo = 1;
														   public MyPreferenceFragment myPreferenceFragment = null;        //設定画面
														   public int myPreferenceFragmentNo = 2;
														   public MyWebFragment webFragment = null;                        //web画面
														   public int webFragmentNo = 3;
														   public RecordService RS = null;
														   private UpdateReceiver upReceiver;
														   private IntentFilter intentFilter;

														   public LocationManager locationManager;
														   double latitudeVal = -1;// 緯度の表示
														   public String latitudeStr = "";
														   double longitudeVal = -1;       // 経度の表示
														   public String LongtudeStr = "";
														   double accuracyVal = -1;                //精度
														   public String accuracyStr = "";
														   double altitudeVal = -1;                //標高
														   public String altitudeStr = "";
														   double pinpointingTimeVal = 0;                //測位時刻
														   public String pinpointingTimeStr = "";
														   public String now_count = "0";

														   */

		#region SharedPreferences
		public static ISharedPreferences sharedPref;
		public ISharedPreferencesEditor myEditor;
		public String student_id = "1234567890";        //"実施者ID（学籍番号）
		public String accountName = "";                     //保存先サーバのアカウント
		public String client_id = "";                               //保存先サーバの使用ID
		public String stock_count = "500";                  //自動送信するデータ数"
		public String waiting_scond = "5";                  //記録間隔
		public String gps_sarch_span = "5";             //GPS情報更新間隔[秒]
		public String gps_mini_destance = "10";     //GPS通知最小距離[m]
		public String local_dir = "";                               //端末内の保存先
		public String local_dir_size = "";                      //保存先の空き容量
		public String max_file_size = "";                       //これまでの最大ファイルサイズ
																//このアプリケーションの設定ファイル読出し//
		public void ReadPrif() {
			String TAG = "ReadPrif[MA]";
			String dbMsg = "開始";
			try {
				if (CheckSTORAGEParmission(rp_readPrif) && CheckGPSParmission(rp_readPrif) && CheckWiFiParmission(rp_readPrif) && CheckAccountParmission(rp_readPrif)) {
					sharedPref = PreferenceManager.GetDefaultSharedPreferences(this);
					ISharedPreferencesEditor myEditor = sharedPref.Edit();
					System.Collections.Generic.IDictionary<string, object> keys = sharedPref.All;
					dbMsg = dbMsg + ",読み込み開始;keys=" + keys.Count + "件";        // keys.size() 

					//        int i = 0;
					//        for (String key : keys.keySet())
					//        {
					//            i++;
					//            String rStr = keys.get(key).toString();
					//            dbMsg = dbMsg + "\n" + i + "/" + keys.size() + ")" + key + "は" + rStr;
					//            try
					//            {
					//                if (key.equals("student_id_key"))
					//                {
					//                    student_id = keys.get(key).toString();
					//                    dbMsg = dbMsg + ",実施者ID（学籍番号）=" + student_id;
					//                }
					//                else if (key.equals("accountName_key"))
					//                {
					//                    accountName = keys.get(key).toString();
					//                    dbMsg = dbMsg + ",保存先サーバのアカウント=" + accountName;
					//                }
					//                else if (key.equals("client_id_key"))
					//                {
					//                    client_id = keys.get(key).toString();
					//                    dbMsg = dbMsg + ",保存先サーバのclient Id=" + client_id;
					//                }
					//                else if (key.equals("stock_count_key"))
					//                {
					//                    stock_count = keys.get(key).toString();
					//                    dbMsg = dbMsg + ",自動送信するデータ数=" + stock_count;
					//                }
					//                else if (key.equals("waiting_scond_key"))
					//                {
					//                    waiting_scond = keys.get(key).toString();
					//                    dbMsg = dbMsg + ",記録間隔=" + waiting_scond;
					//                }
					//                else if (key.equals("gps_sarch_span_key"))
					//                {
					//                    if (!keys.get(key).toString().isEmpty())
					//                    {
					//                        gps_sarch_span = keys.get(key).toString();
					//                    }
					//                    dbMsg = dbMsg + ",GPS情報通知間隔[秒]=" + gps_sarch_span;
					//                }
					//                else if (key.equals("gps_mini_destance_key"))
					//                {
					//                    if (!keys.get(key).toString().isEmpty())
					//                    {
					//                        gps_mini_destance = keys.get(key).toString();
					//                    }
					//                    dbMsg = dbMsg + ",GPS通知最小距離[m]=" + gps_mini_destance;
					//                }
					//                else if (key.equals("local_dir_key"))
					//                {
					//                    local_dir = keys.get(key).toString();
					//                    dbMsg = dbMsg + ",端末内の保存先=" + local_dir;
					//                }
					//                else if (key.equals("local_dir_size_key"))
					//                {
					//                    local_dir_size = keys.get(key).toString();
					//                    dbMsg = dbMsg + ",保存先の空き容量=" + local_dir_size;
					//                }
					//                else if (key.equals("max_file_size_key"))
					//                {
					//                    max_file_size = keys.get(key).toString();
					//                    dbMsg = dbMsg + ",これまでの最大ファイルサイズ=" + max_file_size;
					//                }
					//            }
					//            catch (Exception e)
					//            {
					//                myLog(TAG, dbMsg + "で" + e.toString());
					//            }
					//        }
					//        //課題；保存先サーバのアカウント
					//        setSaveParameter();                 //保存可能上限の確認と修正
					//		}
					//	}
					//}
				}
				MyLog(TAG, dbMsg);
			} catch (Exception er) {
				MyLog(TAG, dbMsg + "；" + er);
			}
		}                                                                     //プリファレンスの読込み
		#endregion

		#region RunTime Parmission
		public const int rp_inet = 0x11;                   //アカウント変更		☆Java;static→const
		public const int rp_sendDatas = 0x12;        //データ送信
		public const int rp_strage = 0x21;               //データ保存
		public const int rp_setting = 0x22;                //設定保存
		public const int rp_readPrif = 0x23;           //設定読み出し
		public const int rp_makeList = 0x24;           //保存したデータの読み込み
		public const int rp_saveLocalFile = 0x25;  //端末内にファイル保存
		public const int rp_apListUp = 0x31;           //圏内のwifiAPの検出
		public const int rp_getNowConect = 0x32;   //接続先APの検出
		public const int rp_getGPSInfo = 0x41;     //GPS

		public Boolean CheckSTORAGEParmission(int reTry) {
			String TAG = "CheckSTORAGEParmission";
			String dbMsg = "開始";
			Boolean retBool = false;
			try {
				string[] permissions = new string[] { Android.Manifest.Permission.ReadExternalStorage,
											  Android.Manifest.Permission.WriteExternalStorage };
				if (context.CheckSelfPermission(Android.Manifest.Permission.ReadExternalStorage) != Permission.Granted ||
						context.CheckSelfPermission(Android.Manifest.Permission.WriteExternalStorage) != Permission.Granted) {
					RequestPermissions(permissions, reTry);             //(Activity)context)
					dbMsg = ">>OnRequestPermissionsResult";
				} else {
					retBool = true;
				}
				MyLog(TAG, dbMsg);
			} catch (Exception er) {
				MyLog(TAG, dbMsg + "；" + er);
				//         "開始；System.InvalidCastException: Specified cast is not valid.\n  at NuAPloger.Droid.MainActivity.CheckSTORAGEParmission (System.Int32 reTry) [0x00056] in C:\\work\\Xa\\NuAPloger\\NuAPloger\\NuAPloger.Android\\MainActivity.cs:347 "
			}
			return retBool;
		}

		public Boolean CheckGPSParmission(int reTry) {
			String TAG = "CheckGPSParmission";
			String dbMsg = "開始";
			Boolean retBool = false;
			try {
				string[] permissions = new string[] { Android.Manifest.Permission.AccessFineLocation,
											  Android.Manifest.Permission.AccessCoarseLocation };
				if (context.CheckSelfPermission(Android.Manifest.Permission.AccessFineLocation) != Permission.Granted ||
						context.CheckSelfPermission(Android.Manifest.Permission.AccessCoarseLocation) != Permission.Granted) {
					RequestPermissions(permissions, reTry);          // ((Activity)context).?
					dbMsg = ">>OnRequestPermissionsResult";
				} else {
					retBool = true;
				}
				MyLog(TAG, dbMsg);
			} catch (Exception er) {
				MyLog(TAG, dbMsg + "；" + er);
			}
			return retBool;
		}

		public Boolean CheckWiFiParmission(int reTry) {
			String TAG = "CheckSTORAGEParmission";
			String dbMsg = "開始";
			Boolean retBool = false;
			try {
				string[] permissions = new string[] { Android.Manifest.Permission.AccessWifiState,
											  Android.Manifest.Permission.ChangeWifiState };
				if (context.CheckSelfPermission(Android.Manifest.Permission.AccessWifiState) != Permission.Granted ||
						context.CheckSelfPermission(Android.Manifest.Permission.ChangeWifiState) != Permission.Granted) {
					((Activity)context).RequestPermissions(permissions, reTry);
					dbMsg = ">>OnRequestPermissionsResult";
				} else {
					retBool = true;
				}
				MyLog(TAG, dbMsg);
			} catch (Exception er) {
				MyLog(TAG, dbMsg + "；" + er);
			}
			return retBool;
		}

		//Google Drive,Accountへのアクセス
		public Boolean CheckAccountParmission(int reTry) {
			String TAG = "CheckAccountParmission";
			String dbMsg = "開始";
			Boolean retBool = false;
			try {
				string[] permissions = new string[] { Android.Manifest.Permission.Internet,
											  Android.Manifest.Permission.GetAccounts };
				if (context.CheckSelfPermission(Android.Manifest.Permission.Internet) != Permission.Granted ||
						context.CheckSelfPermission(Android.Manifest.Permission.GetAccounts) != Permission.Granted) {
					RequestPermissions(permissions, reTry);
					dbMsg = ">>OnRequestPermissionsResult";
				} else {
					retBool = true;
				}
				MyLog(TAG, dbMsg);
			} catch (Exception er) {
				MyLog(TAG, dbMsg + "；" + er);
			}
			return retBool;
		}

		/// <summary>
		/// Parmissionダイアログの戻り値処理
		/// 20180117時点ではXamarinに標準装備されていないのでXam.Plugin.Mediaを使用
		/// </summary>
		/// <param name="requestCode"></param>
		/// <param name="permissions"></param>
		/// <param name="grantResults"></param>
		public override void OnRequestPermissionsResult(int requestCode, string[] permissions, Permission[] grantResults) {                 //許可ダイアログの承認結果を受け取る（許可・不許可）
			PermissionsImplementation.Current.OnRequestPermissionsResult(requestCode, permissions, grantResults);
			//			global::ZXing.Net.Mobile.Forms.Android.PermissionsHandler.OnRequestPermissionsResult(requestCode, permissions, grantResults);
			String TAG = "OnRequestPermissionsResult";
			String dbMsg = "permissions=" + permissions;
			dbMsg += ",grantResults[0]=" + grantResults[0];
			if (grantResults.Cast<Permission>().All(x => x == Permission.Granted)) {
				//		if (grantResults.Length > 0 && grantResults[0] .Equals( Permission.Granted)) {
				dbMsg += ",requestCode=" + requestCode;
				switch (requestCode) {
					case rp_inet:
						//              transmissionChange();
						break;
					case rp_sendDatas:
						//              sendDatas();                                     //GoogleDriveへデータ転送
						break;
					case rp_strage:
						//                 makeList();                                        //保存済みファイルの読み込み
						break;
					case rp_setting:
						//                callSetting();                                    //設定変更画面
						break;
					case rp_readPrif:
						ReadPrif();                                                     //設定読み出し
						break;
					case rp_saveLocalFile:
						//          save2Local();                                       //端末内にファイル保存
						break;
					case rp_makeList:
						//                   makeList();                                        //保存したデータの読み込み
						break;
					case rp_apListUp:
						//               getWiFiDatas();                                    //WiFiリストアップ
						break;
					case rp_getNowConect:
						//             getNowConect();                                    //接続先APの検出
						break;
					case rp_getGPSInfo:
						//              getGPSDatas();                                    //GPS利用
						break;
					default:
						dbMsg += ",not permitted";
						break;
				}
				//	//   switchが使えない？
				//	if (requestCode == rp_inet) {
				//	//              transmissionChange();
				//} else if (requestCode == rp_sendDatas) {
				//	//              sendDatas();                                     //GoogleDriveへデータ転送
				//} else if (requestCode == rp_strage) {
				//	//                 makeList();                                        //保存済みファイルの読み込み
				//} else if (requestCode == rp_setting) {
				//	//                callSetting();                                    //設定変更画面
				//} else if (requestCode == rp_readPrif) {
				//	ReadPrif();														//設定読み出し
				//} else if (requestCode == rp_saveLocalFile) {
				//	//          save2Local();                                       //端末内にファイル保存
				//} else if (requestCode == rp_makeList) {
				//	//                   makeList();                                        //保存したデータの読み込み
				//} else if (requestCode == rp_apListUp) {
				//	//               getWiFiDatas();                                    //WiFiリストアップ
				//} else if (requestCode == rp_getNowConect) {
				//	//             getNowConect();                                    //接続先APの検出
				//} else if (requestCode == rp_getGPSInfo) {
				//	//              getGPSDatas();                                    //GPS利用
				//}
			} else {
				dbMsg += ",not permitted";
				MyLog(TAG, dbMsg);
			}
		}
		//Android6 Marshmallow以降のパーミッションについて                    http://itblogdsi.blog.fc2.com/blog-entry-258.html
		//Xamarin.Android で Runtime Permissions を実装した時にはまった http://blog.shibayan.jp/entry/20160303/1456971272
		#endregion

		#region LifeCycle
		/// <summary>
		/// 読み込み開始
		/// </summary>
		/// <param name="bundle"></param>

		protected override void OnCreate(Bundle savedInstanceState) {
			base.OnCreate(savedInstanceState);

			// Set our view from the "main" layout resource
			SetContentView(Resource.Layout.Main);
		}
		/// <summary>
		/// 全ての読み込みが終わった時
		/// ？？ここに来ない？？
		/// </summary>
		/// <param name="hasFocus"></param>
		//public override void OnWindowFocusChanged(Boolean hasFocus) {
		//	String TAG = "OnWindowFocusChanged[MA]";
		//	String dbMsg = "開始";
		//	try {
		//		MyLog(TAG, dbMsg);
		//	} catch (Exception er) {
		//		MyLog(TAG, dbMsg + "；" + er);
		//	}
		//}

		///// <summary>
		///// onStart, onPauseの次にアクティブになる都度
		///// </summary>
		//protected override void OnResume() {
		//	String TAG = "onResume[MA]";
		//	String dbMsg = "";//////////////////E/ActivityThread: Performing stop of activity that is not resumed: {com.hijiyama_koubou.atare_kun/com.hijiyama_koubou.atare_kun.AtarekunnActivity
		//	try {
		//		//			callMain();
		//		MyLog(TAG, dbMsg);
		//	} catch (Exception er) {
		//		MyLog(TAG, dbMsg + "で" + er.ToString());
		//	}
		//}                                                                 // onStart, onPauseの次
		#endregion

		#region menu
		public static int MENU_main = 0;                    //メイン画面	     <item android:id="@+id/mm_main"	android:orderInCategory="101"	android:title="@string/main_screen"/>
		public static int MENU_conectedt = MENU_main + 1;    //現在の接続先       <item  android:id="@+id/mm_conected" android:orderInCategory="102"  android:title="@string/current_connection"/>
		public static int MENU_PLC = MENU_conectedt + 1;    //現在地確認       <item android:id="@+id/mm_present_location_confirmation"  android:orderInCategory="103" android:title="@string/present_location_confirmation"　android:icon="@android:drawable/ic_dialog_map"-->
		public static int MENU_share = MENU_PLC + 1;        //登録したログの確認   <item android:id="@+id/mm_share" android:orderInCategory="104" android:title="@string/Indication_of_the_registered_log"/>
		public static int MENU_TC = MENU_share + 1;            //廃止；送信先変更    <item  android:id="@+id/mm_transmission_change" android:orderInCategory="107"  android:title="@string/transmission_change"/>
		public static int MENU_disconect = MENU_TC + 1;        //回線切断              <item android:id="@+id/mm_" android:orderInCategory="108" android:title="@string/info_a_setudann"/>
		public static int MENU_prefarence = MENU_disconect + 1;        //設定画面   <item android:id="@+id/mm_prefarence" android:title="@string/action_settings"  android:orderInCategory="189"/>
		public static int MENU_quit = MENU_prefarence + 1;            //    <item android:id="@+id/mm_quit" android:orderInCategory="199" android:title="@string/menu_item_sonota_end"/>
		public static int mMenuType = MENU_main;                    //メニューレイアウト管理用変数

		//public override bool OnCreateOptionsMenu(IMenu menu) {
		//	String TAG = "OnCreateOptionsMenu[MA]";
		//	String dbMsg = "";//////////////////
		//	try {
		//		MenuInflater.Inflate(Resource.Menu.OptionMenu, menu);
		//		MyLog(TAG, dbMsg);
		//	} catch (Exception er) {
		//		MyLog(TAG, dbMsg + "；" + er);
		//	}
		//	return true;
		//}

		//public override bool OnMenuItemSelected(int featureId, IMenuItem item) {
		//	switch (item.ItemId) {
		//		case MENU_main:
		//			Toast.MakeText(this, "selected optionMenu1", ToastLength.Short).Show();
		//			break;
		//		case Resource.Id.optionMenu2:
		//			Toast.MakeText(this, "selected optionMenu2", ToastLength.Short).Show();
		//			return true;
		//		case Resource.Id.optionMenu3:
		//			Toast.MakeText(this, "selected optionMenu3", ToastLength.Short).Show();
		//			return true;
		//	}
		//	return false;
		//}
		#endregion

		#region Utilety
		public void MessageShow(String titolStr, String mggStr) {
			//    new AlertDialog.Builder(MainActivity).setTitle(titolStr).setMessage(mggStr).setPositiveButton(android.R.string.ok, new DialogInterface.OnClickListener() {
			//    @Override

			//    public void onClick(DialogInterface dialog, int which)
			//    {
			//    }
			//}).create().show();
		}

		public Boolean debugNow = true;
		public void MyLog(String TAG, String dbMsg) {
			try {
				if (debugNow) {
					Android.Util.Log.Info(TAG, dbMsg);
					Console.WriteLine(TAG + " : " + dbMsg);
				}
			} catch (Exception er) {
				Android.Util.Log.Error(TAG, dbMsg + "で" + er.ToString());
			}
		}

		#endregion
	}
}