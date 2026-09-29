# XODE 컴파일하기

## Github 환경 설정

기존 SSH 키 확인: 기존 SSH 키가 있는지 확인합니다. 다음 명령을 실행하여 기존 키 목록을 확인하세요:

```bash
ls -al ~/.ssh
```

id\_rsa 또는 id\_rsa.pub라는 이름의 파일을 찾으세요.

새 SSH 키 생성(필요한 경우): SSH 키가 없거나 새로 생성하려면 다음 명령을 사용할 수 있습니다:

```bash
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

안내에 따라 새 키를 생성합니다. "your\_email@example.com"을 실제 이메일 주소로 바꾸는 것을 잊지 마세요.

SSH 에이전트에 SSH 키 추가: SSH 에이전트를 시작하고 개인 키를 추가합니다:

```bash
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_rsa
```

SSH 키를 클립보드에 복사: 다음 명령을 사용하여 SSH 키를 클립보드에 복사합니다:

```bash
cat ~/.ssh/id_rsa.pub
```

GitHub에 SSH 키 추가:

GitHub 계정 설정으로 이동합니다.  
"SSH and GPG keys" 또는 "SSH keys"로 이동합니다.  
"New SSH key" 또는 "Add SSH key"를 클릭합니다.  
제공된 입력란에 키를 붙여넣고 제목을 지정합니다.

Xode-Blockchain 클론(clone)

```bash
git clone git@github.com:D2-Xode/xode-blockchain.git
cd xode-blockchain
```

## Rust 환경 설정

build-essential 패키지를 설치합니다.

```bash
sudo apt install build-essential
```

Rust 지원 패키지 설치

```bash
sudo apt install --assume-yes git clang curl libssl-dev protobuf-compiler
sudo apt install --assume-yes git clang curl libssl-dev llvm libudev-dev make protobuf-compiler
```

다음 명령을 실행하여 rustup 설치 프로그램을 다운로드하고 이를 사용해 Rust를 설치합니다.

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

다음 명령을 실행하여 현재 셸에 Cargo가 포함되도록 업데이트합니다

```bash
source $HOME/.cargo/env
```

다음 명령을 실행하여 Rust 툴체인(toolchain)의 기본값을 최신 stable 버전으로 설정합니다

```bash
rustup default stable
rustup update
```

다음 명령을 실행하여 개발 환경에 nightly 릴리스와 nightly WebAssembly(wasm) 타깃을 추가합니다:

```bash
rustup update nightly
rustup target add wasm32-unknown-unknown --toolchain nightly
rustup default nightly-x86_64-unknown-linux-gnu
```

다음 명령을 실행하여 개발 환경 구성을 확인합니다.

```bash
rustup show
rustup +nightly show
```

스마트 컨트랙트(smart contract)를 위한 WASM 지원 설치

```bash
rustup target add wasm32-unknown-unknown
```

Xode를 컴파일하고 노드 실행

```bash
cargo build
```

## Raspberry Pi(aarch64) 환경용 컴파일

cross 크레이트(crate) 설치

```bash
cargo install cross
```

Docker 설치

```bash
sudo apt update
```

apt가 패키지를 사용할 수 있도록 하는 몇 가지 필수 패키지를 설치합니다

```bash
sudo apt install apt-transport-https ca-certificates curl software-properties-common
```

공식 Docker 저장소의 GPG 키를 시스템에 추가합니다

```bash
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
```

Docker 저장소를 APT 소스에 추가합니다

```bash
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

패키지를 다시 업데이트합니다

```bash
sudo apt update
```

Docker 저장소에서 설치하려는 것이 맞는지 확인합니다

```bash
apt-cache policy docker-ce
```

Docker 설치

```bash
sudo apt install docker-ce
```

Docker 상태 확인

```bash
sudo systemctl status docker
```

sudo 없이 Docker를 사용할 수 있도록 설정

```bash
sudo usermod -aG docker ${USER}
su - ${USER}
groups
```

이제 크로스 컴파일(cross compile)을 실행합니다

```bash
cross +nightly build --target aarch64-unknown-linux-gnu --release
```

## Zombienet을 사용하여 XODE 실행하기

xode-node 바이너리가 완전히 컴파일되어 실행되는지 테스트합니다

```bash
./target/release/xode-node --version
```

Polkadot 바이너리를 다운로드합니다(이 바이너리를 다운로드할 때 zombienet 디렉터리에 있는지 확인하세요)

```bash
wget https://github.com/paritytech/polkadot/releases/download/v1.0.0/polkadot
```

Zombienet 바이너리를 다운로드합니다(이 바이너리를 다운로드할 때 zombienet 디렉터리에 있는지 확인하세요)

```bash
wget https://github.com/paritytech/zombienet/releases/download/v1.3.109/zombienet-linux-x64
```

두 바이너리를 실행 가능하게 만듭니다

```bash
chmod +x polkadot
chmod +x zombienet-linux-x64
```

Zombienet을 사용하여 XODE 실행

```bash
./zombienet-launch.sh
```
