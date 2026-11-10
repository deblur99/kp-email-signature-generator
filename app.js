(function () {
  const EMAIL_DOMAIN = "@knowledgepoint.co.kr";
  const DEFAULTS = {
    name: "",
    title: "대리",
    company: "(주)날리지포인트",
    officePhone: "070-4325-4033",
    mobilePrefix: "010",
    mobileNumber: "",
    emailLocal: "",
    address: "서울 서초구 사임당로10길 3, 5층 (서초동, 원진빌딩)",
  };

  const form = document.getElementById("signature-form");
  const preview = document.getElementById("preview");
  const htmlOutput = document.getElementById("html-output");
  const copyBtn = document.getElementById("copy-btn");
  const clearBtn = document.getElementById("clear-btn");
  const copyStatus = document.getElementById("copy-status");

  const fields = {
    name: document.getElementById("name"),
    title: document.getElementById("title"),
    company: document.getElementById("company"),
    officePhone: document.getElementById("office-phone"),
    mobilePrefix: document.getElementById("mobile-prefix"),
    mobileNumber: document.getElementById("mobile-number"),
    emailLocal: document.getElementById("email-local"),
    address: document.getElementById("address"),
  };

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function formatMobile(prefix, rest) {
    const cleaned = String(rest || "").replace(/[^\d-]/g, "").replace(/^-+/, "");
    if (!cleaned) return prefix;
    return `${prefix}-${cleaned}`;
  }

  function getCiUrl() {
    return `${window.location.origin}/assets/KP_CI_horizontal.png`;
  }

  function buildSignatureHtml(data) {
    const ciUrl = escapeHtml(data.ciUrl);
    const name = escapeHtml(data.name);
    const title = escapeHtml(data.title);
    const company = escapeHtml(data.company);
    const officePhone = escapeHtml(data.officePhone);
    const mobile = escapeHtml(data.mobile);
    const email = escapeHtml(data.email);
    const address = escapeHtml(data.address);

    return `<table cellspacing="0" cellpadding="0" border="0" style="border: 2px solid #000;width:100%;background:#ffffff;">    <tbody>      <tr>        <td valign="middle" style="padding: 26px 0;background:#ffffff;">          <table cellspacing="0" cellpadding="0" border="0" style="width:100%">            <tbody>              <tr>                <td width="219" align="center" style="padding-right:7px;"><p><img src="${ciUrl}" style="width: 80%;"><br></p></td>                <td valign="top" style="padding-left:21px;border-left:1px solid #e0e0e0">                  <table cellspacing="0" cellpadding="0" border="0" style="width:100%">                    <tbody>                      <tr>                        <td style="position:relative;top:-3px;padding-bottom:8px;font-weight:bold;font-size:14px;font-family:'맑은 고딕','Malgun Gothic','돋움',dotum,sans-serif">${name}</td>                      </tr>                      <tr>                        <td style="font-size:12px;font-family:'맑은 고딕','Malgun Gothic','돋움',dotum,sans-serif;line-height:17px;color:#888">${title}<span style="position:relative;top:-1px;padding:0 6px;color:#d7d7d7">|</span>${company}</td>                      </tr>                      <tr>                        <td style="font-size:12px;font-family:'맑은 고딕','Malgun Gothic','돋움',dotum,sans-serif;line-height:17px;color:#888"><p><span style="font-weight:bold;color:#111">t</span>  ${officePhone}<span style="position:relative;top:-1px;padding:0 6px;color:#d7d7d7">|</span><span style="font-weight:bold;color:#111">m</span>  ${mobile}<span style="position:relative;top:-1px;padding:0 6px;color:#d7d7d7">|</span><span style="font-weight:bold;color:#111">e</span>&nbsp;${email}</p></td>                      </tr>                      <tr>                        <td style="font-size:12px;font-family:'맑은 고딕','Malgun Gothic','돋움',dotum,sans-serif;line-height:17px;color:#888"><p><span style="font-weight:bold;color:#111">a</span>&nbsp;${address}</p></td>                      </tr>                    </tbody>                  </table>                </td>              </tr>            </tbody>          </table>        </td>      </tr>    </tbody>  </table><p><br></p>`;
  }

  function readForm() {
    return {
      name: fields.name.value.trim(),
      title: fields.title.value,
      company: fields.company.value.trim() || DEFAULTS.company,
      officePhone: fields.officePhone.value.trim() || DEFAULTS.officePhone,
      mobile: formatMobile(fields.mobilePrefix.value, fields.mobileNumber.value.trim()),
      email: `${fields.emailLocal.value.trim()}${EMAIL_DOMAIN}`,
      address: fields.address.value.trim() || DEFAULTS.address,
      ciUrl: getCiUrl(),
    };
  }

  function setOutput(html) {
    preview.innerHTML = html;
    htmlOutput.value = html;
    copyBtn.disabled = !html;
    copyStatus.textContent = "";
  }

  function resetForm() {
    fields.name.value = DEFAULTS.name;
    fields.title.value = DEFAULTS.title;
    fields.company.value = DEFAULTS.company;
    fields.officePhone.value = DEFAULTS.officePhone;
    fields.mobilePrefix.value = DEFAULTS.mobilePrefix;
    fields.mobileNumber.value = DEFAULTS.mobileNumber;
    fields.emailLocal.value = DEFAULTS.emailLocal;
    fields.address.value = DEFAULTS.address;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const data = readForm();
    if (!data.name) {
      fields.name.focus();
      copyStatus.textContent = "이름을 입력해 주세요.";
      return;
    }
    if (!fields.emailLocal.value.trim()) {
      fields.emailLocal.focus();
      copyStatus.textContent = "이메일을 입력해 주세요.";
      return;
    }
    if (!fields.mobileNumber.value.trim()) {
      fields.mobileNumber.focus();
      copyStatus.textContent = "휴대폰 번호를 입력해 주세요.";
      return;
    }

    setOutput(buildSignatureHtml(data));
  });

  copyBtn.addEventListener("click", async function () {
    const html = htmlOutput.value;
    if (!html) return;

    try {
      await navigator.clipboard.writeText(html);
      copyStatus.textContent = "HTML을 클립보드에 복사했습니다.";
    } catch (error) {
      htmlOutput.focus();
      htmlOutput.select();
      copyStatus.textContent = "복사에 실패했습니다. 코드를 직접 선택해 복사해 주세요.";
    }
  });

  clearBtn.addEventListener("click", function () {
    resetForm();
    setOutput("");
    fields.name.focus();
  });
})();
