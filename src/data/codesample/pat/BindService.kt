private var service: IPATService? = null
private val mServiceConnection: ServiceConnection = object : ServiceConnection {
     override fun onServiceConnected(componentName: ComponentName, iBinder: IBinder) {
          service = IPATService.Stub.asInterface(iBinder)
          if (service != null) {
               Toast.makeText(
                    this@BrowserActivity,
                    "binding service success",
                    Toast.LENGTH_SHORT
               ).show()
               Log.w(TAG, "PAT Service Binding success")
          }
     }

     override fun onServiceDisconnected(componentName: ComponentName) {
          service = null
     }
}

private fun bindPATService() {
     if (service != null) return
     val intent = Intent("com.samsung.android.privateaccesstokens.PAT_SERVICE.BIND")
     intent.setPackage("com.samsung.android.privateaccesstokens")
     intent.setClassName("com.samsung.android.privateaccesstokens", "com.samsung.android.privateaccesstokens.components.services.PATService")
     bindService(intent, mServiceConnection, Context.BIND_AUTO_CREATE)

     Log.w(TAG, "PAT Service Binding success")
}