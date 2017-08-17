namespace WindowsFormsApp1
{
    partial class Form1
    {
        /// <summary>
        /// 必要なデザイナー変数です。
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// 使用中のリソースをすべてクリーンアップします。
        /// </summary>
        /// <param name="disposing">マネージ リソースを破棄する場合は true を指定し、その他の場合は false を指定します。</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows フォーム デザイナーで生成されたコード

        /// <summary>
        /// デザイナー サポートに必要なメソッドです。このメソッドの内容を
        /// コード エディターで変更しないでください。
        /// </summary>
        private void InitializeComponent()
        {
			this.components = new System.ComponentModel.Container();
			System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(Form1));
			this.webBrowser1 = new System.Windows.Forms.WebBrowser();
			this.listBox1 = new System.Windows.Forms.ListBox();
			this.timeNow = new System.Windows.Forms.Label();
			this.secTimer = new System.Windows.Forms.Timer(this.components);
			this.comboBox1 = new System.Windows.Forms.ComboBox();
			this.label1 = new System.Windows.Forms.Label();
			this.fileTree = new System.Windows.Forms.TreeView();
			this.fileinfo = new System.Windows.Forms.Label();
			this.label2 = new System.Windows.Forms.Label();
			this.lastWriteTime = new System.Windows.Forms.Label();
			this.label3 = new System.Windows.Forms.Label();
			this.fileLength = new System.Windows.Forms.Label();
			this.label4 = new System.Windows.Forms.Label();
			this.creationTime = new System.Windows.Forms.Label();
			this.label5 = new System.Windows.Forms.Label();
			this.lastAccessTime = new System.Windows.Forms.Label();
			this.label6 = new System.Windows.Forms.Label();
			this.rExtension = new System.Windows.Forms.Label();
			this.imageList1 = new System.Windows.Forms.ImageList(this.components);
			this.passNameLabel = new System.Windows.Forms.Label();
			this.fileNameLabel = new System.Windows.Forms.Label();
			this.SuspendLayout();
			// 
			// webBrowser1
			// 
			this.webBrowser1.Location = new System.Drawing.Point(441, 4);
			this.webBrowser1.MinimumSize = new System.Drawing.Size(20, 20);
			this.webBrowser1.Name = "webBrowser1";
			this.webBrowser1.Size = new System.Drawing.Size(596, 441);
			this.webBrowser1.TabIndex = 0;
			this.webBrowser1.DocumentCompleted += new System.Windows.Forms.WebBrowserDocumentCompletedEventHandler(this.webBrowser1_DocumentCompleted);
			// 
			// listBox1
			// 
			this.listBox1.FormattingEnabled = true;
			this.listBox1.ItemHeight = 12;
			this.listBox1.Location = new System.Drawing.Point(9, 430);
			this.listBox1.Name = "listBox1";
			this.listBox1.Size = new System.Drawing.Size(421, 76);
			this.listBox1.TabIndex = 2;
			this.listBox1.SelectedIndexChanged += new System.EventHandler(this.listBox1_SelectedIndexChanged);
			// 
			// timeNow
			// 
			this.timeNow.AutoSize = true;
			this.timeNow.Font = new System.Drawing.Font("MS UI Gothic", 18F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(128)));
			this.timeNow.Location = new System.Drawing.Point(269, 400);
			this.timeNow.Name = "timeNow";
			this.timeNow.Size = new System.Drawing.Size(161, 24);
			this.timeNow.TabIndex = 4;
			this.timeNow.Text = "12時34分 56秒";
			this.timeNow.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
			this.timeNow.UseMnemonic = false;
			// 
			// secTimer
			// 
			this.secTimer.Enabled = true;
			this.secTimer.Tick += new System.EventHandler(this.timer1_Tick);
			// 
			// comboBox1
			// 
			this.comboBox1.Font = new System.Drawing.Font("MS UI Gothic", 11.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(128)));
			this.comboBox1.FormattingEnabled = true;
			this.comboBox1.Location = new System.Drawing.Point(92, 401);
			this.comboBox1.Name = "comboBox1";
			this.comboBox1.RightToLeft = System.Windows.Forms.RightToLeft.No;
			this.comboBox1.Size = new System.Drawing.Size(61, 23);
			this.comboBox1.TabIndex = 5;
			this.comboBox1.SelectedIndexChanged += new System.EventHandler(this.comboBox1_SelectedIndexChanged);
			// 
			// label1
			// 
			this.label1.AutoSize = true;
			this.label1.Font = new System.Drawing.Font("MS UI Gothic", 11.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(128)));
			this.label1.Location = new System.Drawing.Point(6, 404);
			this.label1.Name = "label1";
			this.label1.Size = new System.Drawing.Size(80, 15);
			this.label1.TabIndex = 6;
			this.label1.Text = "ドライブ選択";
			this.label1.TextAlign = System.Drawing.ContentAlignment.MiddleRight;
			// 
			// fileTree
			// 
			this.fileTree.Location = new System.Drawing.Point(9, 35);
			this.fileTree.Name = "fileTree";
			this.fileTree.Size = new System.Drawing.Size(426, 289);
			this.fileTree.TabIndex = 7;
			this.fileTree.AfterSelect += new System.Windows.Forms.TreeViewEventHandler(this.treeView1_AfterSelect);
			// 
			// fileinfo
			// 
			this.fileinfo.Location = new System.Drawing.Point(487, 448);
			this.fileinfo.MaximumSize = new System.Drawing.Size(700, 60);
			this.fileinfo.MinimumSize = new System.Drawing.Size(550, 60);
			this.fileinfo.Name = "fileinfo";
			this.fileinfo.Size = new System.Drawing.Size(550, 60);
			this.fileinfo.TabIndex = 8;
			this.fileinfo.Text = "ファイル情報";
			this.fileinfo.TextAlign = System.Drawing.ContentAlignment.TopRight;
			// 
			// label2
			// 
			this.label2.AutoSize = true;
			this.label2.Location = new System.Drawing.Point(7, 337);
			this.label2.Name = "label2";
			this.label2.Size = new System.Drawing.Size(41, 12);
			this.label2.TabIndex = 11;
			this.label2.Text = "更新日";
			this.label2.TextAlign = System.Drawing.ContentAlignment.MiddleRight;
			// 
			// lastWriteTime
			// 
			this.lastWriteTime.AutoSize = true;
			this.lastWriteTime.Location = new System.Drawing.Point(54, 337);
			this.lastWriteTime.Name = "lastWriteTime";
			this.lastWriteTime.Size = new System.Drawing.Size(119, 12);
			this.lastWriteTime.TabIndex = 12;
			this.lastWriteTime.Text = "2999年12月31日 23:59";
			// 
			// label3
			// 
			this.label3.AutoSize = true;
			this.label3.Location = new System.Drawing.Point(197, 337);
			this.label3.Name = "label3";
			this.label3.Size = new System.Drawing.Size(68, 12);
			this.label3.TabIndex = 13;
			this.label3.Text = "ファイルサイズ";
			this.label3.TextAlign = System.Drawing.ContentAlignment.MiddleRight;
			// 
			// fileLength
			// 
			this.fileLength.AutoSize = true;
			this.fileLength.Location = new System.Drawing.Point(271, 337);
			this.fileLength.Name = "fileLength";
			this.fileLength.Size = new System.Drawing.Size(95, 12);
			this.fileLength.TabIndex = 14;
			this.fileLength.Text = "999999999999999";
			this.fileLength.TextAlign = System.Drawing.ContentAlignment.MiddleRight;
			// 
			// label4
			// 
			this.label4.AutoSize = true;
			this.label4.Location = new System.Drawing.Point(7, 359);
			this.label4.Name = "label4";
			this.label4.Size = new System.Drawing.Size(41, 12);
			this.label4.TabIndex = 15;
			this.label4.Text = "作成日";
			this.label4.TextAlign = System.Drawing.ContentAlignment.MiddleRight;
			// 
			// creationTime
			// 
			this.creationTime.AutoSize = true;
			this.creationTime.Location = new System.Drawing.Point(54, 359);
			this.creationTime.Name = "creationTime";
			this.creationTime.Size = new System.Drawing.Size(119, 12);
			this.creationTime.TabIndex = 16;
			this.creationTime.Text = "2999年12月31日 23:59";
			// 
			// label5
			// 
			this.label5.AutoSize = true;
			this.label5.Location = new System.Drawing.Point(197, 359);
			this.label5.Name = "label5";
			this.label5.Size = new System.Drawing.Size(65, 12);
			this.label5.TabIndex = 17;
			this.label5.Text = "最終アクセス";
			this.label5.TextAlign = System.Drawing.ContentAlignment.MiddleRight;
			// 
			// lastAccessTime
			// 
			this.lastAccessTime.AutoSize = true;
			this.lastAccessTime.Location = new System.Drawing.Point(271, 359);
			this.lastAccessTime.Name = "lastAccessTime";
			this.lastAccessTime.Size = new System.Drawing.Size(119, 12);
			this.lastAccessTime.TabIndex = 18;
			this.lastAccessTime.Text = "2999年12月31日 23:59";
			// 
			// label6
			// 
			this.label6.AutoSize = true;
			this.label6.Location = new System.Drawing.Point(7, 381);
			this.label6.Name = "label6";
			this.label6.Size = new System.Drawing.Size(41, 12);
			this.label6.TabIndex = 19;
			this.label6.Text = "拡張子";
			this.label6.TextAlign = System.Drawing.ContentAlignment.MiddleRight;
			// 
			// rExtension
			// 
			this.rExtension.AutoSize = true;
			this.rExtension.Location = new System.Drawing.Point(54, 381);
			this.rExtension.Name = "rExtension";
			this.rExtension.Size = new System.Drawing.Size(25, 12);
			this.rExtension.TabIndex = 20;
			this.rExtension.Text = ".xxx";
			// 
			// imageList1
			// 
			this.imageList1.ImageStream = ((System.Windows.Forms.ImageListStreamer)(resources.GetObject("imageList1.ImageStream")));
			this.imageList1.TransparentColor = System.Drawing.Color.Transparent;
			this.imageList1.Images.SetKeyName(0, "hd_icon.png");
			this.imageList1.Images.SetKeyName(1, "folder_close_icon.png");
			this.imageList1.Images.SetKeyName(2, "docment_icon.png");
			this.imageList1.Images.SetKeyName(3, "move_icon.png");
			this.imageList1.Images.SetKeyName(4, "pict_icon.png");
			this.imageList1.Images.SetKeyName(5, "music_icon.png");
			this.imageList1.Images.SetKeyName(6, "desktop_icon.png");
			this.imageList1.Images.SetKeyName(7, "pc_icon.png");
			this.imageList1.Images.SetKeyName(8, "folder_close_icon.png");
			this.imageList1.Images.SetKeyName(9, "phone_icon.png");
			this.imageList1.Images.SetKeyName(10, "hd_sys_icon.png");
			// 
			// passNameLabel
			// 
			this.passNameLabel.AutoSize = true;
			this.passNameLabel.Location = new System.Drawing.Point(9, 4);
			this.passNameLabel.Name = "passNameLabel";
			this.passNameLabel.Size = new System.Drawing.Size(0, 12);
			this.passNameLabel.TabIndex = 21;
			// 
			// fileNameLabel
			// 
			this.fileNameLabel.AutoSize = true;
			this.fileNameLabel.Location = new System.Drawing.Point(9, 20);
			this.fileNameLabel.Name = "fileNameLabel";
			this.fileNameLabel.Size = new System.Drawing.Size(41, 12);
			this.fileNameLabel.TabIndex = 22;
			this.fileNameLabel.Text = "未選択";
			// 
			// Form1
			// 
			this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 12F);
			this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
			this.ClientSize = new System.Drawing.Size(1039, 505);
			this.Controls.Add(this.fileNameLabel);
			this.Controls.Add(this.passNameLabel);
			this.Controls.Add(this.rExtension);
			this.Controls.Add(this.label6);
			this.Controls.Add(this.lastAccessTime);
			this.Controls.Add(this.label5);
			this.Controls.Add(this.creationTime);
			this.Controls.Add(this.label4);
			this.Controls.Add(this.fileLength);
			this.Controls.Add(this.label3);
			this.Controls.Add(this.lastWriteTime);
			this.Controls.Add(this.label2);
			this.Controls.Add(this.fileinfo);
			this.Controls.Add(this.fileTree);
			this.Controls.Add(this.label1);
			this.Controls.Add(this.comboBox1);
			this.Controls.Add(this.timeNow);
			this.Controls.Add(this.listBox1);
			this.Controls.Add(this.webBrowser1);
			this.Name = "Form1";
			this.Text = "これから始まる";
			this.Load += new System.EventHandler(this.Form1_Load);
			this.ResumeLayout(false);
			this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.WebBrowser webBrowser1;
        private System.Windows.Forms.ListBox listBox1;
        private System.Windows.Forms.Label timeNow;
        private System.Windows.Forms.Timer secTimer;
        private System.Windows.Forms.ComboBox comboBox1;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.TreeView fileTree;
        private System.Windows.Forms.Label fileinfo;
		private System.Windows.Forms.Label label2;
		private System.Windows.Forms.Label lastWriteTime;
		private System.Windows.Forms.Label label3;
		private System.Windows.Forms.Label fileLength;
		private System.Windows.Forms.Label label4;
		private System.Windows.Forms.Label creationTime;
		private System.Windows.Forms.Label label5;
		private System.Windows.Forms.Label lastAccessTime;
		private System.Windows.Forms.Label label6;
		private System.Windows.Forms.Label rExtension;
		private System.Windows.Forms.ImageList imageList1;
		private System.Windows.Forms.Label passNameLabel;
		private System.Windows.Forms.Label fileNameLabel;
	}
}

