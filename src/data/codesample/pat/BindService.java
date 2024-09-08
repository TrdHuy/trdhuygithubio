private IPATService service = null;
private ServiceConnection mServiceConnection = new ServiceConnection() {
    @Override
    public void onServiceConnected(ComponentName componentName, IBinder iBinder) {
        service = IPATService.Stub.asInterface(iBinder);
        if (service != null) {
            Toast.makeText(BrowserActivity.this, "binding service success", Toast.LENGTH_SHORT).show();
            Log.w(TAG, "PAT Service Binding success");
        }
    }

    @Override
    public void onServiceDisconnected(ComponentName componentName) {
        service = null;
    }
};

private void bindPATService() {
    if (service != null) return;
    Intent intent = new Intent("com.samsung.android.privateaccesstokens.PAT_SERVICE.BIND");
    intent.setPackage("com.samsung.android.privateaccesstokens");
    intent.setClassName("com.samsung.android.privateaccesstokens", "com.samsung.android.privateaccesstokens.components.services.PATService");
    bindService(intent, mServiceConnection, Context.BIND_AUTO_CREATE);

    Log.w(TAG, "PAT Service Binding success");
}
