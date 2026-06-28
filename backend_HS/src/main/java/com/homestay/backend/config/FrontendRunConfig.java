package com.homestay.backend.config;

import jakarta.annotation.PreDestroy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.util.ClassUtils;

import java.io.File;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

@Component
public class FrontendRunConfig implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(FrontendRunConfig.class);
    private static final String NPM_COMMAND = "npm.cmd";
    private static final String DEV_SCRIPT = "dev";
    private static final String DEV_HOST = "localhost";
    private static final String JUNIT_TEST_CLASS = "org.junit.jupiter.api.Test";
    private static final int DEV_PORT = 5173;
    private static final int PORT_CHECK_TIMEOUT_MILLIS = 300;
    private static final int PORT_RETRY_SECONDS = 5;
    private static final long PROCESS_STOP_TIMEOUT_SECONDS = 3L;
    private static final Path FRONTEND_FROM_ROOT = Path.of("frontend_HS", "frontend");
    private static final Path FRONTEND_FROM_BACKEND = Path.of("..", "frontend_HS", "frontend");

    private Process frontendProcess;

    @Override
    public void run(ApplicationArguments args) {
        if (isTestRuntime()) {
            log.info("Skipping frontend dev server startup during tests.");
            return;
        }

        if (isPortOpen(DEV_HOST, DEV_PORT)) {
            log.info("Frontend dev server already available at http://{}:{}/", DEV_HOST, DEV_PORT);
            return;
        }

        resolveFrontendDirectory().ifPresentOrElse(
                frontendDirectory -> startFrontend(frontendDirectory.toFile()),
                () -> log.warn("Frontend directory not found; skipped dev server startup.")
        );
    }

    @PreDestroy
    public void stopFrontend() {
        if (frontendProcess == null || !frontendProcess.isAlive()) {
            return;
        }
        killProcessTree(frontendProcess);
        log.info("Stopped frontend dev server.");
    }

    private void startFrontend(File frontendDirectory) {
        List<String> command = List.of(
                "cmd.exe", "/c",
                NPM_COMMAND, "run", DEV_SCRIPT, "--",
                "--host", DEV_HOST,
                "--port", String.valueOf(DEV_PORT),
                "--strictPort"
        );

        try {
            ProcessBuilder builder = new ProcessBuilder(command);
            builder.directory(frontendDirectory);
            builder.redirectErrorStream(true);
            builder.redirectOutput(ProcessBuilder.Redirect.INHERIT);
            frontendProcess = builder.start();
            log.info("Started frontend dev server at http://{}:{}/", DEV_HOST, DEV_PORT);
        } catch (IOException e) {
            log.warn("Failed to start frontend dev server from {}", frontendDirectory.getAbsolutePath(), e);
        }
    }

    private void killProcessTree(Process process) {
        List<ProcessHandle> childProcesses = process.descendants().toList();
        childProcesses.forEach(ProcessHandle::destroy);
        process.destroy();

        try {
            if (!process.waitFor(PROCESS_STOP_TIMEOUT_SECONDS, TimeUnit.SECONDS)) {
                childProcesses.stream()
                        .filter(ProcessHandle::isAlive)
                        .forEach(ProcessHandle::destroyForcibly);
                process.destroyForcibly();
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            childProcesses.stream()
                    .filter(ProcessHandle::isAlive)
                    .forEach(ProcessHandle::destroyForcibly);
            process.destroyForcibly();
        }
    }

    private Optional<Path> resolveFrontendDirectory() {
        List<Path> candidatePaths = List.of(
                Path.of("frontend_HS", "frontend").toAbsolutePath().normalize(),
                Path.of("..", "frontend_HS", "frontend").toAbsolutePath().normalize()
        );

        return candidatePaths.stream()
                .filter(Files::isDirectory)
                .filter(FrontendRunConfig::hasPackageJson)
                .findFirst();
    }

    private static boolean hasPackageJson(Path directory) {
        return Files.exists(directory.resolve("package.json"));
    }

    private boolean isPortOpen(String host, int port) {
        try (Socket socket = new Socket()) {
            socket.connect(new InetSocketAddress(host, port), PORT_CHECK_TIMEOUT_MILLIS);
            return true;
        } catch (IOException e) {
            return false;
        }
    }

    private boolean isTestRuntime() {
        return ClassUtils.isPresent(JUNIT_TEST_CLASS, getClass().getClassLoader());
    }
}