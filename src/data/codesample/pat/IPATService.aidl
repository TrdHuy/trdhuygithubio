interface IPATService {
    String requestToken(String originUrl, String challengeList);
    void setPatState(boolean isEnabled);
    boolean getPatState();
}