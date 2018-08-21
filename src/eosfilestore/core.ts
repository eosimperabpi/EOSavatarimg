// import * as Base64 from 'base64-js'
// import * as fs from "fs";
// import mime from 'mime-types'
// const Eos = require('eosjs')
import * as Eos from 'eosjs'
// import { splitString } from './utils'
import { wif } from './costants'
import BigNumber from "bignumber.js"

/* tslint:disable */
const ScatterJS = require('scatter-js/dist/scatter.cjs')

const config = {
  chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
  // chainId: '038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca',
  keyProvider: [wif],
  httpEndpoint: 'https://api1.eosasia.one',
  // httpEndpoint: 'http://jungle.cryptolions.io:18888',
  // TODO: changeable https://api.eosnewyork.io https://nodes.get-scatter.com https://api1.eosasia.one
  expireInSeconds: 60,
  broadcast: true,
  verbose: false, // API activity
  sign: true
}

const eos = Eos(config)

const network = {
  blockchain: 'eos',
  host: 'nodes.get-scatter.com',
  // host: 'jungle.cryptolions.io',
  port: 443,
  protocol: 'https',
  chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
  // chainId: '038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca'
};
// UPDATE
// NOTE: https://github.com/GetScatter/ScatterWebExtension/issues/60#issuecomment-399634757
export function doTx(memo: string, account: any): Promise<any> {
  return new Promise((resolve: any) => {
    setTimeout(() => {
      ScatterJS.scatter.connect("eosavatarimg").then((connected: any) => {
        if (!connected) {
          // User does not have Scatter Desktop or Classic installed. 
          // return false;
          console.error('Scatter not active')
        }

        ScatterJS.scatter.getIdentity({ accounts: [network] }).then((identity: any) => {
          const account = identity.accounts.find((acc: any) => acc.blockchain === 'eos');
          const eoss = ScatterJS.scatter.eos(network, Eos, { broadcast: true, chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906' }, "http");
          // const requiredFields = { accounts: [network] };
          // const options = {
          //   authorization: [`${account.name}@${account.authority}`]
          // }
          const options = {
            authorization: [`${account.name}@${account.authority}`]
          }
          console.log('aaaacc', account)
          eoss.contract('eosavatarimg').then((contract: any) => {
            // memo is blob
            contract.update(account.name, memo, options).then((res: any) => {
              resolve(res)
            })
          });
        });

      })

    }, 100); // NOTE: rate limit?
  })
}

export function doRemoveAvatar(account: any): Promise<any> {
  return new Promise((resolve: any) => {

      // const network = {
      //   blockchain: 'eos',
      //   host: 'nodes.get-scatter.com',
      //   // host: 'jungle.cryptolions.io',
      //   port: 443,
      //   protocol: 'https',
      //   chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
      //   // chainId: '038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca'
      // };

      ScatterJS.scatter.connect("eosavatarimg").then((connected: any) => {
        if (!connected) {
          // User does not have Scatter Desktop or Classic installed. 
          // return false;
          console.error('Scatter not active')
        }

        ScatterJS.scatter.getIdentity({ accounts: [network] }).then((identity: any) => {
          const account = identity.accounts.find((acc: any) => acc.blockchain === 'eos');
          const eoss = ScatterJS.scatter.eos(network, Eos, { broadcast: true, chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906' }, "http");
          // const requiredFields = { accounts: [network] };
          // const options = {
          //   authorization: [`${account.name}@${account.authority}`]
          // }
          const options = {
            authorization: [`${account.name}@${account.authority}`]
          }
          eoss.contract('eosavatarimg').then((contract: any) => {
            // memo is blob
            contract.remove(account.name, options).then((res: any) => {
              resolve(res)
            })
          });
        });

      })

  })
}

// GET table
export function fetchAvatar(account: string) {
  return new Promise((resolve, reject) => {
    // eos.getTableRows(true, 'eosavatarimg', 'eosavatarimg', 'profiles', 'account', account, 0, 1)
    const encAcc = new BigNumber(Eos.modules.format.encodeName(account, false))
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
        if (data.rows[0].avatar_data) {
          resolve(data.rows[0])
        } else {
          reject('empty avatar')
        }
      })
      .catch((err: any) => reject(err))
  })
}

export function fetchTx(txid: string, buffer?: string, fm?: any): Promise<any> {
  return new Promise((resolve: any, reject: any) => {
    eos.getTransaction(txid).then((data: any) => {
      const fmd = {
        cpu_usage_us: (fm) ? fm.cpu_usage_us : 0,
        net_usage_words: (fm) ? fm.net_usage_words : 0,
      }
      // console.log(JSON.stringify(data.trx.trx.actions[0].data.msg))
      // console.log(data.trx.trx.actions[0].data.memo) // data.trx.trx.actions[0].data.memo

      // const memo = JSON.parse(data.trx.trx.actions[0].data.memo)
      // OK
      // setTimeout(() => {
      // console.log('l ', data.trx.trx.actions[0].data.memo)
      const toParse = data.trx.trx.actions[0].data.msg
      // console.log(toParse)
      const memo = JSON.parse(toParse)
      const fileMetadata = {
        block_time: data.block_time,
        cpu_usage_us: fmd.cpu_usage_us + data.trx.receipt.cpu_usage_us,
        net_usage_words: fmd.net_usage_words + data.trx.receipt.net_usage_words,
        upload_by: data.trx.trx.actions[0].authorization[0].actor
      }
      // debugger
      console.log(`${memo.n}`) // verbose
      if (memo.n) {
        resolve(fetchTx(memo.n, `${buffer}${memo.c}`, fileMetadata))
      } else {
        resolve({ data: `${buffer}${memo.c}`, fileMetadata })
        // return false
      }
      // }, 100)

    }).catch((e: any) => reject(e))
  })
}

export function prepareChunks(filepath: string): Promise<string[]> {
  return new Promise((resolve: any, reject: any) => {
    resolve([])
    // fs.readFile(filepath, (err: any, data: Uint8Array) => {
    //   if (err) {
    //     console.error(err)
    //     reject([])
    //   }
    //   const blob = Base64.fromByteArray(data);
    //   const mimetype = mime.lookup(filepath)
    //   const dataString = `data:${mimetype};base64,${blob}`
    //   // console.log(dataString)
    //   const chunks = splitString(dataString, maxPayloadSize);

    //   resolve(chunks)
    // });
  })
}


/*

{
  "broadcast": true,
  "transaction": {
    "compression": "none",
    "transaction": {
      "expiration": "2018-08-02T13:28:34",
      "ref_block_num": 25582,
      "ref_block_prefix": 3813040338,
      "net_usage_words": 0,
      "max_cpu_usage_ms": 0,
      "delay_sec": 0,
      "context_free_actions": [],
      "actions": [
        {
          "account": "eosfilestore",
          "name": "upload",
          "authorization": [
            {
              "actor": "gq4dmnjzgige",
              "permission": "active"
            }
          ],
          "data": "09646574737461736132"
        }
      ],
      "transaction_extensions": []
    },
    "signatures": [
      "SIG_K1_K6xtddLWTfRZHubGcfcRZDQB21E7Tew46QSKZkQ52guCSvhpVHbNzhuMgNo3BuWabN7K9bViEkHLqWxXito448SXie18iE"
    ]
  },
  "transaction_id": "bc4c0aa870fa922a9d2bdc59fcc90911638c38f9a67fbd05ce04ad54765cccf6",
  "processed": {
    "id": "bc4c0aa870fa922a9d2bdc59fcc90911638c38f9a67fbd05ce04ad54765cccf6",
    "receipt": {
      "status": "executed",
      "cpu_usage_us": 450,
      "net_usage_words": 13
    },
    "elapsed": 450,
    "net_usage": 104,
    "scheduled": false,
    "action_traces": [
      {
        "receipt": {
          "receiver": "eosfilestore",
          "act_digest": "154eec21519da8015f9ffdd82f16a6c35735a8316bee681456d8444483afa648",
          "global_sequence": 149343810,
          "recv_sequence": 87,
          "auth_sequence": [
            [
              "gq4dmnjzgige",
              563
            ]
          ],
          "code_sequence": 1,
          "abi_sequence": 1
        },
        "act": {
          "account": "eosfilestore",
          "name": "upload",
          "authorization": [
            {
              "actor": "gq4dmnjzgige",
              "permission": "active"
            }
          ],
          "data": {
            "msg": "detstasa2"
          },
          "hex_data": "09646574737461736132"
        },
        "elapsed": 182,
        "cpu_usage": 0,
        "console": "",
        "total_cpu_usage": 0,
        "trx_id": "bc4c0aa870fa922a9d2bdc59fcc90911638c38f9a67fbd05ce04ad54765cccf6",
        "inline_traces": []
      }
    ],
    "except": null
  },
  "returnedFields": {
    "accounts": [
      {
        "name": "gq4dmnjzgige",
        "authority": "active",
        "blockchain": "eos"
      }
    ]
  }
}

*/