import { useRef, useState } from "react";
import "./App.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { DeleteOutline } from "@mui/icons-material";
import { readMdInDirs, relpath, transform } from "./until";

import {
  Box,
  Button,
  CircularProgress,
  ListItem,
  ListItemButton,
  ListItemText,
  TextField,
} from "@mui/material";
import { FixedSizeList as List, ListChildComponentProps } from "react-window";

function App() {
  // let dir = "C:/Users/Snowy/Documents/GitHub/md2tid/src";

  const [dirs, setDirs] = useState<string[]>([]);
  const sourcePathRef = useRef<string>("");
  const [targetPath, setTargetPath] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // remove(testwfile);
  function renderRow(props: ListChildComponentProps) {
    const { index, style } = props;
    let value = dirs[index];
    let rel_path = relpath(value, sourcePathRef.current);
    return (
      <ListItem
        style={style}
        component="div"
        key={value}
        disableGutters
        secondaryAction={
          <ListItemButton
            aria-label="deleteItem"
            onClick={() =>
              setDirs((currentDirs) =>
                currentDirs.filter((dir) => dir !== value)
              )
            }
          >
            <DeleteOutline />
          </ListItemButton>
        }
      >
        <ListItemText primary={`VFile: ${rel_path}`} />
      </ListItem>
    );
  }

  return (
    <>
      <p>欢迎使用Any Markdown To TiddlyWiki</p>
      <main className="container">
        <TextField
          id="outlined-basic"
          label="输入"
          variant="outlined"
          size="small"
          style={{ marginBottom: 10 }}
          onChange={(e) => {
            sourcePathRef.current = e.target.value;
          }}
        />
        <TextField
          id="outlined-basic"
          label="输出"
          variant="outlined"
          size="small"
          style={{ marginBottom: 10 }}
          value={targetPath}
          onChange={(e) => {
            setTargetPath(e.target.value);
          }}
        />
        <Button
          variant="outlined"
          style={{ marginBottom: 10 }}
          onClick={async () => {
            setIsLoading(true);
            let dirs = await readMdInDirs(sourcePathRef.current);
            setDirs(dirs);
            setIsLoading(false);
          }}
        >
          读取文件列表
        </Button>
        {isLoading ? (
          <Box
            sx={{
              height: 300,
              borderRadius: 1,
            }}
            display="flex"
            justifyContent="center" // 水平居中
            alignItems="center" // 垂直居中
          >
            <CircularProgress style={{}} />
          </Box>
        ) : (
          <List
            height={300}
            width={"100%"}
            itemSize={30}
            itemCount={dirs.length}
            overscanCount={5}
            style={{ maxHeight: 400 }}
          >
            {renderRow}
          </List>
        )}

        <Button
          variant="outlined"
          onClick={() => {
            for (let index = 0; index < dirs.length; index++) {
              const element = dirs[index];
              transform(sourcePathRef.current, element, targetPath);
            }
          }}
        >
          开始转换文件
        </Button>
      </main>{" "}
    </>
  );
}

export default App;
