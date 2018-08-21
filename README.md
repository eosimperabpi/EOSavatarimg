# EOSavatarimg

EOSavatarimg is an EOS smart contract and a Web UI to manage your avatar associated to your EOS account. 3rd part dApp can display it if it is present.

### How to use the avatar from my dApp?

You can use the official EOSjs API and pass the `account` you what to see the avatar

```
const encodedAccount = new BigNumber(Eos.modules.format.encodeName(accountToSearch, false))
eos.getTableRows({
  code: 'eosavatarimg',
  json: true,
  limit: 1,
  lower_bound: encAcc.toString(),
  scope: 'eosavatarimg',
  table: 'profiles',
  upper_bound: encAcc.plus(1).toString()
})
.then((data: any) => {
  resolve(data.rows[0])
  // { avatar_data: 'base64blob...', updated_at: 1234}
})
.catch((err: any) => reject(err))
```

### Features and TODO

- [x] Base React + Mobx + Router
- [x] Download from txid in url
- [x] Implemented download from txid 
- [ ] Share the same eosfilestore node/javascript
- [x] Scatter integration
- [x] Implement upload
- [ ] Estimation of CPU and NET before the upload
- [ ] Responsive mobile
- [ ] Better txid progress visualization
- [ ] Clean up UI / Code / tests / types ...

### License

EOSavatarimg is [MIT licensed](./LICENSE).