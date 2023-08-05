const { expect } = require("chai");

describe("MyERC20Token", function () {
  let MyERC20Token;
  let myERC20Token;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    MyERC20Token = await ethers.getContractFactory("MyERC20Token");
    myERC20Token = await MyERC20Token.deploy(1000); // Deploy the ERC-20 token contract with an initial supply of 1000 tokens
    await myERC20Token.deployed();
  });

  it("Should have correct name, symbol, and decimals", async function () {
    expect(await myERC20Token.name()).to.equal("My ERC-20 Token");
    expect(await myERC20Token.symbol()).to.equal("MET");
    expect(await myERC20Token.decimals()).to.equal(18);
  });

  it("Should assign the initial supply to the owner", async function () {
    expect(await myERC20Token.balanceOf(owner.address)).to.equal(
      1000 * 10 ** 18
    );
  });

  it("Should transfer tokens between accounts", async function () {
    await myERC20Token.transfer(addr1.address, 100);
    expect(await myERC20Token.balanceOf(addr1.address)).to.equal(100);

    await myERC20Token.connect(addr1).transfer(addr2.address, 50);
    expect(await myERC20Token.balanceOf(addr2.address)).to.equal(50);
  });

  it("Should fail if trying to transfer more tokens than the balance", async function () {
    const initialBalance = await myERC20Token.balanceOf(owner.address);
    await expect(myERC20Token.transfer(addr1.address, initialBalance + 1)).to.be
      .reverted;
  });
});
