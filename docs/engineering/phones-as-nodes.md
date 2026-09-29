---
pageClass: article-page
---

<p class="article-eyebrow">Engineering · XODE omni</p>

# What do you have to prove to call a phone a node?

Running a blockchain light node on a smartphone is hard, but it's a solvable problem. The truly hard part comes next: the moment you attach rewards to it, saying you ran the node without running it becomes far cheaper than running it.

<p class="article-byline">By <strong>Gene Son</strong> · XODE · omni node design</p>

## What "your phone is a node" actually means

"Your phone becomes a node" is a common line in mobile DePIN apps. Most of the time, what it actually means is **the app sends a server a signal at regular intervals**. Every five minutes the app tells the backend "I'm alive", and the server counts those check-ins and pays rewards.

That isn't a node. It's an attendance sheet.

In omni, we drew this line in the code itself. The app keeps two status flags.

<div class="claim-compare">

::: warning Weak claim
**Received straight from the chain**

The app fetched the latest block from a chain RPC endpoint without going through our backend. There's one less middleman, but it's still *a number someone else told it*.
:::

::: tip Strong claim
**The phone verified it itself**

The light client on the device checked finality on its own. It's a number the phone *worked out*, not one it asked for.
:::

</div>

The second flag **stays at 0** until the native `smoldot` light client has finished its warp sync. If something hasn't been verified, the app doesn't say it has. This distinction is where the design of the whole app starts.

## Add rewards and the problem changes

Say you give out tokens for running a node. From that moment, the most rational move is no longer to run a node. It's **to find the cheapest way to look like you're running one**.

Spin up hundreds of emulators. Write a script that only imitates the heartbeat packets. Keep swapping accounts on a single device. Spend no battery and no data, and collect the rewards. People who run the node honestly lose out by comparison, and in the end nobody runs it honestly.

> The hard part of DePIN isn't getting the work done. It's getting proof that the work was done.

## Why heartbeats lie so easily

The most naive heartbeat looks like this: the app asks the server for the current block height, signs that number and sends it back. The server checks the signature and pays a reward.

So what does this heartbeat actually prove? Only that **"someone holding this key signed the number we just gave them."** It doesn't have to be a phone, or a node, or even the app. One line of curl will do.

<HeartbeatProof />

So we moved verification onto the phone. When the light client connects to the chain directly and checks finality, what the heartbeat signs is no longer *a number someone else supplied* but *a result this device computed*. To fake it, imitation isn't enough: you have to actually run a light client, and at that point you've already done the work.

## One layer still isn't enough

Moving verification onto the phone still leaves a hole. One powerful device can run a single light client and sign the same result for hundreds of accounts. The work is done once, and the reward is paid hundreds of times.

So we built the defenses in layers. Each layer answers a different question.

<div class="defense-layers">

- **Layer 1 · Did this node really follow the chain?**

  The on-device light client's own verification. Imitation can't get past it.

- **Layer 2 · Is this a real device, and does it belong to this account?**

  Hardware key assertion. Devices are registered, and only heartbeats whose assertion the backend has verified are accepted. This is where emulator farms and account swapping are stopped.

- **Layer 3 · How many devices can one person profit from?**

  A monthly cap per account. Even after getting past the first two layers, nobody can scale up without limit.

</div>

The third layer is the key one. **You have to assume that technical defenses will be broken one day.** So that the damage doesn't keep growing in step when they are, the last line of defense has to be economic. With a cap in place, the cost of getting around the defenses soon exceeds the rewards there are to gain.

## Being honest about failure

This design has one trap on the user experience side. There are several reasons a reward can be zero, but the screen usually shows only one.

Zero because you hit the monthly cap and zero because your device failed verification are completely different situations. The first one clears if you *wait for next month*; the second only clears if you *re-authenticate now*. But if both show up as "0 earned today", a user whose verification is blocked just waits, and loses a month.

> The same number needs a different message when the cause is different, because the fix is different.

So when the backend gate returns zero, it **sends a reason code with it**, and the app shows different guidance for each code. We made it a rule in a code comment: *never show an attestation problem as "monthly cap reached."*

## Battery and data are the real constraints

If everything so far is design, whether people actually keep the app running is a completely different fight. A node on a phone has to live within two budgets: **battery and mobile data.** Go over either one and users delete the app, however big the rewards are.

Early builds used more than 90 MB an hour. The light client's peer discovery loop was running more than it needed to, and the checkpoint was out of date, so every catch-up covered a long stretch of chain. Fixing the discovery loop and updating the checkpoint brought usage down to **around 50 MB an hour**.

Work like this never makes a blog headline, but it's usually what decides whether a DePIN app lives or dies. Nobody deletes an app over "finality verification." They delete it over their data bill.

## Summary

Turning a phone into a node is three problems stacked together: **getting it to follow the chain** (the light client), **getting it to prove that it did** (where verification happens, plus hardware keys), and **getting people to keep it running** (battery and data).

Miss any one of the three and the rest stops mattering. A node without verification is an attendance sheet, rewards without proof are a farm, and nobody turns on an app that eats their battery.

<p class="article-next">In the next article: how a wallet app uses the results this node has verified, in other words "a wallet that doesn't ask a server for your balance."</p>
