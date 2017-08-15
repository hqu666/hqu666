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
			this.webBrowser1 = new System.Windows.Forms.WebBrowser();
			this.listBox1 = new System.Windows.Forms.ListBox();
			this.timeNow = new System.Windows.Forms.Label();
			this.secTimer = new System.Windows.Forms.Timer(this.components);
			this.comboBox1 = new System.Windows.Forms.ComboBox();
			this.label1 = new System.Windows.Forms.Label();
			this.treeView1 = new System.Windows.Forms.TreeView();
			this.fileinfo = new System.Windows.Forms.Label();
			this.textBox1 = new System.Windows.Forms.TextBox();
			this.textBox2 = new System.Windows.Forms.TextBox();
			this.SuspendLayout();
			// 
			// webBrowser1
			// 
			this.webBrowser1.Location = new System.Drawing.Point(444, 33);
			this.webBrowser1.MinimumSize = new System.Drawing.Size(20, 20);
			this.webBrowser1.Name = "webBrowser1";
			this.webBrowser1.Size = new System.Drawing.Size(596, 512);
			this.webBrowser1.TabIndex = 0;
			this.webBrowser1.DocumentCompleted += new System.Windows.Forms.WebBrowserDocumentCompletedEventHandler(this.webBrowser1_DocumentCompleted);
			// 
			// listBox1
			// 
			this.listBox1.FormattingEnabled = true;
			this.listBox1.ItemHeight = 12;
			this.listBox1.Location = new System.Drawing.Point(12, 33);
			this.listBox1.Name = "listBox1";
			this.listBox1.Size = new System.Drawing.Size(426, 148);
			this.listBox1.TabIndex = 2;
			this.listBox1.SelectedIndexChanged += new System.EventHandler(this.listBox1_SelectedIndexChanged);
			// 
			// timeNow
			// 
			this.timeNow.AutoSize = true;
			this.timeNow.Font = new System.Drawing.Font("MS UI Gothic", 18F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(128)));
			this.timeNow.Location = new System.Drawing.Point(12, 521);
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
			this.comboBox1.Location = new System.Drawing.Point(98, 4);
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
			this.label1.Location = new System.Drawing.Point(12, 7);
			this.label1.Name = "label1";
			this.label1.Size = new System.Drawing.Size(80, 15);
			this.label1.TabIndex = 6;
			this.label1.Text = "ドライブ選択";
			this.label1.TextAlign = System.Drawing.ContentAlignment.MiddleRight;
			// 
			// treeView1
			// 
			this.treeView1.Location = new System.Drawing.Point(12, 187);
			this.treeView1.Name = "treeView1";
			this.treeView1.Size = new System.Drawing.Size(426, 280);
			this.treeView1.TabIndex = 7;
			this.treeView1.AfterSelect += new System.Windows.Forms.TreeViewEventHandler(this.treeView1_AfterSelect);
			// 
			// fileinfo
			// 
			this.fileinfo.AutoSize = true;
			this.fileinfo.Location = new System.Drawing.Point(190, 4);
			this.fileinfo.MinimumSize = new System.Drawing.Size(850, 0);
			this.fileinfo.Name = "fileinfo";
			this.fileinfo.Size = new System.Drawing.Size(850, 12);
			this.fileinfo.TabIndex = 8;
			this.fileinfo.Text = "ファイル情報";
			this.fileinfo.TextAlign = System.Drawing.ContentAlignment.MiddleRight;
			// 
			// textBox1
			// 
			this.textBox1.Location = new System.Drawing.Point(12, 473);
			this.textBox1.Name = "textBox1";
			this.textBox1.Size = new System.Drawing.Size(426, 19);
			this.textBox1.TabIndex = 9;
			// 
			// textBox2
			// 
			this.textBox2.Location = new System.Drawing.Point(12, 499);
			this.textBox2.Name = "textBox2";
			this.textBox2.Size = new System.Drawing.Size(426, 19);
			this.textBox2.TabIndex = 10;
			// 
			// Form1
			// 
			this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 12F);
			this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
			this.ClientSize = new System.Drawing.Size(1039, 550);
			this.Controls.Add(this.textBox2);
			this.Controls.Add(this.textBox1);
			this.Controls.Add(this.fileinfo);
			this.Controls.Add(this.treeView1);
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
        private System.Windows.Forms.TreeView treeView1;
        private System.Windows.Forms.Label fileinfo;
		private System.Windows.Forms.TextBox textBox1;
		private System.Windows.Forms.TextBox textBox2;
	}
}

