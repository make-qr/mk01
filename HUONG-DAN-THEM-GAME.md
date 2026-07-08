# Hướng dẫn thêm game mới

Tài liệu này mô tả cách thêm game vào website Monkey Mart một cách **dễ dàng** và **đồng nhất**.

---

## Tổng quan: 3 phần cần có cho mỗi game

| # | Thành phần | Mô tả |
|---|------------|--------|
| 1 | **Ảnh thumbnail** | File ảnh trong `assets/img/img-up/` |
| 2 | **Trang game** | File HTML trong thư mục `game/` (nếu game có trang chơi riêng) |
| 3 | **Thẻ game trên trang chủ** | Một đoạn HTML (snippet) trong `index.html` hoặc trong danh sách data |

---

## Cách 1: Thêm nhanh (chỉ hiển thị trên trang chủ)

Dùng khi bạn chỉ muốn game **xuất hiện trong danh sách** (link sang trang khác hoặc trang game đã có sẵn).

### Bước 1: Chuẩn bị ảnh

- **Tên file:** viết thường, không dấu, nhiều từ cách nhau bằng dấu gạch ngang.  
  Ví dụ: `my-new-game.png` hoặc `traffic-jam-3d.png`
- **Định dạng:** `.png` hoặc `.jpg`
- **Đường dẫn:** đặt file vào thư mục  
  `assets/img/img-up/`

### Bước 2: Thêm thẻ game vào trang chủ

Mở file **`index.html`**, tìm đoạn có các thẻ `<a class="game-item">`. Chèn **một khối** mới (có thể đặt ngay sau `<div class="game-frame-title">` hoặc cùng nhóm với game khác):

```html
<a class="game-item" href="game/TEN-SLUG.html">
  <img loading="lazy" alt="TEN-SLUG" src="../assets/img/img-up/TEN-SLUG.png"/>
  <span>Tên hiển thị game</span>
</a>
```

**Thay thế:**

- `TEN-SLUG` → slug của game (giống tên file ảnh, không phần mở rộng). Ví dụ: `my-new-game`, `traffic-jam-3d`
- `TEN-SLUG.png` → đúng tên file ảnh (nếu dùng `.jpg` thì đổi thành `.jpg`)
- `Tên hiển thị game` → tên bạn muốn hiển thị dưới ảnh (có dấu, viết hoa bình thường)

**Ví dụ cụ thể:**

```html
<a class="game-item" href="game/super-mario.html">
  <img loading="lazy" alt="super-mario" src="../assets/img/img-up/super-mario.png"/>
  <span>Super Mario</span>
</a>
```

Lưu file `index.html`.

### Bước 3: (Nếu cần) Tạo trang game

Nếu game cần **trang riêng** (chơi trực tiếp trên site), làm tiếp **Cách 2** bên dưới.

---

## Cách 2: Thêm game đầy đủ (có trang chơi riêng)

Dùng khi game có **trang chơi** riêng (iframe hoặc nhúng game).

### Bước 1 và 2

Giống **Cách 1**: có ảnh trong `assets/img/img-up/` và đã thêm thẻ game vào `index.html`.

### Bước 3: Tạo file trang game

1. Vào thư mục **`game/`**.
2. Copy một trang game có sẵn làm mẫu, ví dụ:
   - `game/example-game.html` hoặc
   - `game/2048.html`
3. Đổi tên file thành: **`TEN-SLUG.html`** (ví dụ: `super-mario.html`).

### Bước 4: Chỉnh nội dung trang mẫu

Mở file vừa tạo và tìm + thay các chỗ sau (dùng Tìm & Thay thế):

| Tìm (hoặc nội dung tương tự) | Thay bằng |
|-----------------------------|-----------|
| Example Game | **Tên game của bạn** |
| example-game | **TEN-SLUG** (slug giống tên file) |
| example game.png | **TEN-SLUG.png** (đúng tên file ảnh) |
| example-game.html | **TEN-SLUG.html** |
| Play Example Game... | Mô tả ngắn về game (cho SEO) |

**Các vị trí thường cần sửa:**

- Thẻ `<title>`
- Các thẻ `<meta name="description">`, `<meta name="keywords">`
- `og:title`, `og:description`, `og:image`, `og:url`
- Trong Schema.org (JSON-LD): `name`, `description`, `url`, `image`
- Trong Breadcrumb: tên game và link
- **Phần chơi game:** tìm `data-src="..."` hoặc `src="..."` của iframe và đổi thành **URL game thật** (embed từ nguồn game).

### Bước 5: Đặt URL game (iframe)

Trong trang game, tìm đoạn iframe hoặc nút "Play" gắn với URL. Ví dụ:

```html
<iframe data-src="https://example.com/embed/game-url" ...></iframe>
```

Đổi `https://example.com/embed/game-url` thành **đường dẫn embed thật** của game.

Lưu tất cả file.

---

## Quy ước đặt tên (slug)

- **Chỉ dùng:** chữ thường (a–z), số (0–9), dấu gạch ngang `-`
- **Ví dụ đúng:** `traffic-jam-3d`, `fireboy-and-watergirl-1`, `2048`
- **Ví dụ sai:** `Traffic Jam 3D`, `game_mới`, `game mới`

Slug dùng cho:

- Tên file ảnh: `assets/img/img-up/[slug].png`
- Trang game: `game/[slug].html`
- Trong HTML: `href="game/[slug].html"`, `alt="[slug]"`

---

## Checklist thêm game mới

- [ ] Ảnh đã đặt tại `assets/img/img-up/[slug].png` (hoặc `.jpg`)
- [ ] Đã thêm thẻ `<a class="game-item">` vào `index.html` (slug, ảnh, tên hiển thị đúng)
- [ ] (Nếu có trang chơi) Đã tạo `game/[slug].html` từ file mẫu
- [ ] (Nếu có trang chơi) Đã sửa title, meta, schema, breadcrumb và **URL iframe** trong `game/[slug].html`

---

## Công cụ hỗ trợ

Trong thư mục **`tools/`** có file **`game-snippet-generator.html`**:

- Mở bằng trình duyệt (double-click hoặc kéo vào browser).
- Nhập **slug** và **tên hiển thị**.
- Nhấn nút để tạo đoạn HTML thẻ game.
- Copy và dán vào `index.html` tại vị trí bạn muốn.

Dùng công cụ này để tránh gõ nhầm và giữ đúng format.

---

## Tóm tắt nhanh

1. **Ảnh** → `assets/img/img-up/[slug].png`
2. **Thẻ trên trang chủ** → thêm 1 khối `<a class="game-item">` trong `index.html` (hoặc dùng `tools/game-snippet-generator.html`)
3. **Trang game (nếu cần)** → copy `game/example-game.html` → đổi tên thành `game/[slug].html` → sửa title, meta, schema và URL iframe

Nếu cần thêm nhiều game và muốn quản lý bằng **một file danh sách** (ví dụ JSON) rồi tự sinh HTML, có thể mở rộng thêm bước build hoặc script sau.
